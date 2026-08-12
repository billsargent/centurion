// ============================================================
// WebSocket Server for Browser Connectivity
// Implements the same binary protocol as the existing
// WSConnection class, allowing the browser UI to connect
// as a monitoring/control frontend to the server-side emulator.
// ============================================================

import { WebSocketServer, WebSocket } from 'ws';
import { ICCPU, CharDevice, WSMessageType } from '../../shared/interfaces';

/**
 * CPU state snapshot that gets sent to browser clients.
 * Serialized as binary using the same encoding as RemCPU.decode_bytes().
 */
interface CPUStateSnapshot {
    sscr: number;       // [0]: V M F L . map
    level: number;      // [1]
    memaddr: number;    // [2]
    physaddr: number;   // [3]
    sys_data: number;   // [4w]
    run_count: number;  // [5w]
    ledac: Uint32Array; // [6b-11w]: 28 values
    regfile: Uint8Array;// [12row,13sparse]
    pagetb: Uint8Array; // [14row,15sparse]
    workaddr: number;   // [16]
    result: number;     // [17]
    rir: number;        // [18]
    rdr: number;        // [19]
    swap: number;       // [20]
    alu_flag: number;   // [21]
    busctl: number;     // [22]
    sysctl: number;     // [23]
    pgram: number;      // [24]
    seq_out: number;    // [25]
    datapath: number;   // [26]
    dma_status: number; // [27]
    micro_op0: number;  // [28]
    micro_op1: number;
    seq_p: number;      // [30]
    seq_h: number;      // [31]
    seq_sp: number;     // [32]
    seq_sf: number[];
    alu_q: number;      // [33]
    alu_r: Uint8Array;  // [34]
    memdata_out: number;// [35]
    memdata_in: number; // [36]
}

export interface WSServerCallbacks {
    onStep: (dbg: boolean) => void;
    onStepN: (count: number) => void;
    onGetState: () => void;
    onReset: () => void;
}

export class EmuWebSocketServer {
    private wss: WebSocketServer;
    private clients: Set<WebSocket> = new Set();
    private cpu: ICCPU;
    private serials: CharDevice[];
    private callbacks: WSServerCallbacks;
    private cpuStateBuf = new Uint8Array(4096);

    constructor(
        port: number,
        cpu: ICCPU,
        serialDevices: CharDevice[],
        callbacks: WSServerCallbacks
    ) {
        this.cpu = cpu;
        this.serials = serialDevices;
        this.callbacks = callbacks;

        this.wss = new WebSocketServer({ port });
        console.log(`[WebSocket] Server listening on port ${port}`);

        this.wss.on('connection', (ws: WebSocket) => {
            this.handleConnection(ws);
        });
    }

    private handleConnection(ws: WebSocket): void {
        console.log(`[WebSocket] Browser client connected`);
        this.clients.add(ws);

        ws.on('message', (data: Buffer) => {
            this.handleMessage(ws, data);
        });

        ws.on('close', () => {
            console.log(`[WebSocket] Browser client disconnected`);
            this.clients.delete(ws);
        });

        ws.on('error', (err: Error) => {
            console.error(`[WebSocket] Client error: ${err.message}`);
            this.clients.delete(ws);
        });
    }

    private handleMessage(ws: WebSocket, data: Buffer): void {
        if (data.length < 2) return;

        const msgType = (data[0] | (data[1] << 8));

        switch (msgType) {
            case 0x0020: // Hello
                this.sendHello(ws);
                break;

            case 0x0040: // Get extensions
                this.sendExtensions(ws);
                break;

            case 0x0009: // Step sync
                this.callbacks.onStep(false);
                this.sendStateUpdate(ws);
                break;

            case 0x000A: // Get state
                this.sendStateUpdate(ws);
                break;

            case 0x000B: // Half step
                this.callbacks.onStep(true);
                this.sendStateUpdate(ws);
                break;

            case 0x000D: // Step N
                if (data.length >= 3) {
                    this.callbacks.onStepN(data[2]);
                    this.sendStateUpdate(ws);
                }
                break;

            case 0x1800: // Serial enumeration
                this.sendSerialEnum(ws);
                break;

            case 0x2000: // Filesystem enumeration
                this.sendFilesystemInfo(ws);
                break;

            default:
                console.log(`[WebSocket] Unknown message: 0x${msgType.toString(16)}`);
        }
    }

    private sendHello(ws: WebSocket): void {
        const buf = Buffer.alloc(24);
        // Mirror the existing hello format
        buf.writeUInt16LE(0x0020, 0);   // size
        buf.writeUInt16LE(0x0300, 2);   // version
        buf.writeUInt16LE(0x5765, 4);   // "We"
        buf.writeUInt32LE(0x6243656e, 6); // "bCen"
        buf.writeUInt32LE(0, 10);
        buf.writeUInt32LE(0, 14);
        buf.writeUInt32LE(0, 18);
        buf[22] = 4;  // extension count
        buf[23] = 0;  // option count
        ws.send(buf);
    }

    private sendExtensions(ws: WebSocket): void {
        // Report available extensions:
        // 0 = remote control
        // 2 = filesystem
        // 3 = serial ports
        const buf = Buffer.alloc(8);
        buf.writeUInt16LE(0x0048, 0);
        buf.writeUInt16LE(0, 2);    // remote control
        buf.writeUInt16LE(2, 4);    // filesystem
        buf.writeUInt16LE(3, 6);    // serial ports
        ws.send(buf);
    }

    private sendStateUpdate(ws: WebSocket): void {
        const snapshot = this.captureState();
        const buf = this.encodeState(snapshot);
        ws.send(buf);
    }

    private sendSerialEnum(ws: WebSocket): void {
        // Report serial devices to the browser
        const listing: [string, string, any][] = [];
        for (let i = 0; i < this.serials.length; i++) {
            const s = this.serials[i];
            listing.push([s.name || `SER${i}`, 'RS232', null]);
        }

        // Simple encoding of serial listing
        // For now, send a minimal response
        const data = JSON.stringify(listing);
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(0x1808, 0);
        ws.send(buf);
    }

    private sendFilesystemInfo(ws: WebSocket): void {
        // Send empty filesystem info for now
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(0x2000, 0);
        ws.send(buf);
    }

    private captureState(): CPUStateSnapshot {
        const cpu = this.cpu;
        return {
            sscr: ((cpu.cc & 8) ? 0x8000 : 0) |
                  ((cpu.cc & 4) ? 0x4000 : 0) |
                  ((cpu.cc & 2) ? 0x2000 : 0) |
                  ((cpu.cc & 1) ? 0x1000 : 0) |
                  (cpu.map & 7),
            level: cpu.level,
            memaddr: cpu.memaddr,
            physaddr: cpu.physaddr,
            sys_data: 0,
            run_count: 255,
            ledac: new Uint32Array(28),
            regfile: cpu.regfile ? new Uint8Array(cpu.regfile) : new Uint8Array(256),
            pagetb: cpu.pagetb ? new Uint8Array(cpu.pagetb) : new Uint8Array(256),
            workaddr: cpu.workaddr,
            result: cpu.result,
            rir: cpu.rir,
            rdr: cpu.rdr,
            swap: cpu.swap,
            alu_flag: cpu.alu_flag,
            busctl: cpu.busctl,
            sysctl: cpu.sysctl,
            pgram: cpu.pgram,
            seq_out: cpu.seq_out,
            datapath: cpu.datapath,
            dma_status: cpu.dma_status,
            micro_op0: cpu.micro_op0,
            micro_op1: cpu.micro_op1,
            seq_p: cpu.seq_p,
            seq_h: cpu.seq_h,
            seq_sp: cpu.seq_sp,
            seq_sf: cpu.seq_sf ? [...cpu.seq_sf] : [0, 0, 0, 0],
            alu_q: cpu.alu_q,
            alu_r: cpu.alu_r ? new Uint8Array(cpu.alu_r) : new Uint8Array(16),
            memdata_out: cpu.memdata_out,
            memdata_in: cpu.memdata_in,
        };
    }

    /** Encode a CPU state snapshot into the binary protocol format */
    private encodeState(snapshot: CPUStateSnapshot): Buffer {
        const buf = Buffer.alloc(2048);
        let offset = 0;

        // Header: 0x04A0 (state update)
        buf.writeUInt16LE(0x04A0, offset); offset += 2;

        // Encode each field with the tag byte that RemCPU.decode_bytes expects
        const writeTag = (tag: number) => { buf[offset++] = tag; };
        const writeByte = (v: number) => { buf[offset++] = v & 0xFF; };
        const writeWord = (v: number) => {
            buf[offset++] = (v >> 8) & 0xFF;
            buf[offset++] = v & 0xFF;
        };
        const write3 = (v: number) => {
            buf[offset++] = (v >> 16) & 0xFF;
            buf[offset++] = (v >> 8) & 0xFF;
            buf[offset++] = v & 0xFF;
        };

        // [0] SSCR
        writeTag(0); writeByte(snapshot.sscr);

        // [1] Level
        writeTag(1); writeByte(snapshot.level);

        // [2] memaddr
        writeTag(2); writeWord(snapshot.memaddr);

        // [3] physaddr
        writeTag(3); write3(snapshot.physaddr);

        // [6] ledac (16 values)
        writeTag(6);
        for (let i = 0; i < 16; i++) writeByte(snapshot.ledac[i]);

        // [8] ledac (4 more)
        writeTag(8);
        for (let i = 16; i < 20; i++) writeByte(snapshot.ledac[i]);

        // [10] ledac (8 more)
        writeTag(10);
        for (let i = 20; i < 28; i++) writeByte(snapshot.ledac[i]);

        // [12] regfile (we send all rows for simplicity - one row at a time)
        // In practice, only changed rows would be sent
        // For now, send 16 rows of 16 bytes
        for (let row = 0; row < 256; row += 16) {
            writeTag(12); writeByte(row);
            for (let i = 0; i < 16; i++) {
                writeByte(snapshot.regfile[row + i]);
            }
        }

        // [16] workaddr
        writeTag(16); writeWord(snapshot.workaddr);

        // [17] result
        writeTag(17); writeByte(snapshot.result);

        // [18] rir
        writeTag(18); writeByte(snapshot.rir);

        // [19] rdr
        writeTag(19); writeByte(snapshot.rdr);

        // [20] swap
        writeTag(20); writeByte(snapshot.swap);

        // [21] alu_flag
        writeTag(21); writeByte(snapshot.alu_flag);

        // [22] busctl
        writeTag(22); writeByte(snapshot.busctl);

        // [23] sysctl
        writeTag(23); writeByte(snapshot.sysctl);

        // [24] pgram
        writeTag(24); writeByte(snapshot.pgram);

        // [25] seq_out
        writeTag(25); writeWord(snapshot.seq_out);

        // [26] datapath
        writeTag(26); writeByte(snapshot.datapath);

        // [30] seq_p
        writeTag(30); writeWord(snapshot.seq_p);

        // [31] seq_h
        writeTag(31); writeWord(snapshot.seq_h);

        // [32] seq stack
        writeTag(32); writeByte(snapshot.seq_sp);
        writeWord(snapshot.seq_sf[0]);
        writeWord(snapshot.seq_sf[1]);
        writeWord(snapshot.seq_sf[2]);
        writeWord(snapshot.seq_sf[3]);

        // [33] alu_q
        writeTag(33); writeByte(snapshot.alu_q);

        // [34] alu_r
        writeTag(34);
        for (let i = 0; i < 16; i++) writeByte(snapshot.alu_r[i]);

        // [35] memdata_out
        writeTag(35); writeByte(snapshot.memdata_out);

        // [36] memdata_in
        writeTag(36); writeByte(snapshot.memdata_in);

        return buf.slice(0, offset);
    }

    /** Broadcast state to all connected browser clients */
    broadcastState(): void {
        const snapshot = this.captureState();
        const buf = this.encodeState(snapshot);
        for (const ws of this.clients) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(buf);
            }
        }
    }

    /** Send serial data to the browser */
    sendSerialData(channel: number, data: number[]): void {
        const buf = Buffer.alloc(3 + data.length);
        buf.writeUInt16LE(0x1820, 0);
        buf[2] = channel;
        for (let i = 0; i < data.length; i++) {
            buf[3 + i] = data[i] & 0xFF;
        }
        this.broadcast(buf);
    }

    /** Send serial control to the browser */
    sendSerialControl(channel: number, rts: boolean): void {
        const buf = Buffer.alloc(4);
        buf.writeUInt16LE(0x1830, 0);
        buf[2] = channel;
        buf[3] = rts ? 1 : 0;
        this.broadcast(buf);
    }

    private broadcast(data: Buffer): void {
        for (const ws of this.clients) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        }
    }
}
