// Boot test v11: detailed I/O trace after H1 input
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');

async function main() {
    console.log('=== Boot Test v11 (I/O trace) ===\n');
    if (!fs.existsSync(DISK_PATH)) { console.error('No disk'); process.exit(1); }
    const diskBuffer = fs.readFileSync(DISK_PATH);
    const arrayBuf = diskBuffer.buffer.slice(diskBuffer.byteOffset, diskBuffer.byteOffset + diskBuffer.length);
    const diskImage = {
        type: 'hawk' as const, filename: 'CENTOS_13.IMG', stride: 400,
        backing_data: arrayBuf, protect: false, data: new Uint8Array(arrayBuf),
    };

    const cenJsPath = path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js');
    loadAMDModule(cenJsPath);
    
    const g = global as any;
    const mcsim = g.window?.cpu;
    const dsk2 = g.window?.io_dsk2;
    const bpl = g.window?.bpl;
    const mux = g.window?.io_mux;

    if (dsk2?.units?.[1]) { dsk2.units[1].image = diskImage; console.log('Disk on Unit 1'); }
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 2 | 8;

    // Hook the MUX port to trace bits/baud configuration and receive
    const MASK_TABLE = [0x1f, 0x3f, 0x7f, 0xff];
    if (mux?.muxports?.[0]) {
        const port0 = mux.muxports[0];
        const origWriteControl = port0.write_control.bind(port0);
        const origReceive = port0.receive.bind(port0);
        const origWriteData = port0.write_data.bind(port0);
        
        port0.write_control = (value: number) => {
            const bitLen = (value >> 1) & 3;
            console.log(`  MUX: write_control=0x${value.toString(16).padStart(2,'0')} → _bit_len=${bitLen} mask=0x${MASK_TABLE[bitLen]?.toString(16)||'undefined'} PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
            return origWriteControl(value);
        };
        port0.receive = (data: number) => {
            const bl = port0._bit_len;
            const mask = MASK_TABLE[bl];
            console.log(`  MUX: receive(0x${data.toString(16).padStart(2,'0')}) _bit_len=${bl} mask=0x${mask?.toString(16)||'undefined'} → stored=0x${(data & (mask??0)).toString(16).padStart(2,'0')}`);
            return origReceive(data);
        };
        port0.write_data = (value: number) => {
            const bl = port0._bit_len;
            const mask = MASK_TABLE[bl];
            console.log(`  MUX: write_data(0x${value.toString(16).padStart(2,'0')}='${String.fromCharCode(value&0x7F)}') _bit_len=${bl} mask=0x${mask?.toString(16)||'undefined'} PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
            return origWriteData(value);
        };
    }

    // Capture MUX TX output
    const muxOutput: number[] = [];
    const capture: any = {
        emu_linked: true, rts: true, name: 'capture',
        receive: (c: number) => { muxOutput.push(c); },
        can_receive: () => true,
        check_send: () => {}, bind_dev: () => {}, get_dev: () => undefined, set_cts: () => {},
    };
    if (mux?.muxports?.[0]) {
        mux.muxports[0].bind_dev(capture);
    }

    // Trace ALL I/O reads/writes
    let ioLog: string[] = [];
    let dsk2StatusReads: string[] = [];
    const origRead = bpl.readbyte.bind(bpl);
    const origWrite = bpl.writebyte.bind(bpl);

    bpl.readbyte = (addr: number) => {
        const val = origRead(addr);
        if (addr >= 0x3F000 && addr <= 0x3FFFF) {
            // DSK2: 0x3F140-0x3F14F
            if (addr >= 0x3F140 && addr <= 0x3F14F) {
                const reg = addr - 0x3F140;
                const regNames = ['status','command','','','unit','','','track','sector','memaddr_hi','memaddr_lo','','','memcnt_hi','memcnt_lo'];
                dsk2StatusReads.push(`RD DSK2[${regNames[reg]||reg}] = 0x${val.toString(16).padStart(2,'0')} PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
            }
            if (ioLog.length < 500) {
                ioLog.push(`RD IO 0x${addr.toString(16).toUpperCase()}=0x${val.toString(16).padStart(2,'0')} PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
            }
        }
        return val;
    };

    bpl.writebyte = (addr: number, val: number) => {
        if (addr >= 0x3F000 && addr <= 0x3FFFF) {
            if (addr >= 0x3F140 && addr <= 0x3F14F) {
                const reg = addr - 0x3F140;
                const regNames = ['status','command','','','unit','','','track','sector','memaddr_hi','memaddr_lo','','','memcnt_hi','memcnt_lo'];
                const cmdNames = ['','READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
                const valStr = reg === 1 ? `${cmdNames[val&7]||val} (0x${val.toString(16)})` : `0x${val.toString(16).padStart(2,'0')}`;
                if (ioLog.length < 500) {
                    ioLog.push(`WR DSK2[${regNames[reg]||reg}] = ${valStr} PC=0x${mcsim.pc.toString(16).toUpperCase()} MA=0x${mcsim.memaddr.toString(16).toUpperCase()} WA=0x${(mcsim.workaddr??'?').toString(16).toUpperCase()}`);
                }
                if (reg === 1) {
                    ioLog.push(`  >>> ISSUE ${cmdNames[val&7]} at PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
                }
            }
        }
        return origWrite(addr, val);
    };

    mcsim.reset();
    if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
    if (g.window) (g.window as any).__rtcGuard = true;
    mcsim.hspre();

    const input = 'H1\r';
    let sent = 0, lastBusy = false, idle = 0;
    const port0 = mux?.muxports?.[0];
    const start = Date.now();
    let lastLogTime = 0;

    while (Date.now() - start < 15000) {
        const elapsed = Date.now() - start;
        if (elapsed - lastLogTime > 2000) {
            lastLogTime = elapsed;
            const pc = mcsim.pc;
            console.log(`  [${(elapsed/1000).toFixed(0)}s] PC=0x${pc.toString(16).toUpperCase()} LVL=${mcsim.level} dsk2.busy=${dsk2?.busy} cmd=${dsk2?.command}`);
        }

        // Tick MUX TX
        if (mux?.muxports) for (const p of mux.muxports) { if (p?.run_tx) try { p.run_tx(); } catch {} }
        // Tick hardware
        const hwList = g.window?.__runHW;
        if (hwList) { for (const d of hwList) { if (d?.run) try { d.run(1); } catch {} } }
        const hshwList = g.window?.__runHSHW;
        if (hshwList) { for (const d of hshwList) { if (d?.run) try { d.run(5); } catch {} } }
        // HS steps
        for (let i = 0; i < 10; i++) { mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); }

        // Send input
        if (port0 && sent < input.length) {
            const busy = port0.read_busy;
            if (!busy && lastBusy) idle = 0;
            if (!busy) idle++;
            if (!busy && idle >= 3) { port0.receive(input.charCodeAt(sent)); sent++; idle = 0; }
            lastBusy = busy;
        }

        // Check for terminal output (MUX TX)
        if (port0) try { port0.check_send(); } catch {}
    }
    mcsim.hsend();

    function termStr(bytes: number[]): string {
        return bytes.map(b => b & 0x7F).map(c => 
            c >= 32 && c < 127 ? String.fromCharCode(c) : 
            c < 32 ? `<${c.toString(16)}>` : `<${c.toString(16)}>`
        ).join('');
    }

    console.log(`\nMUX output: ${termStr(muxOutput)}`);
    console.log(`\nDSK2 status reads:`);
    for (const r of dsk2StatusReads.slice(0, 30)) console.log(`  ${r}`);
    console.log(`\nI/O trace (first 100 entries):`);
    for (const r of ioLog.slice(0, 100)) console.log(`  ${r}`);
    
    // Dump key memory areas
    if (bpl) {
        console.log('\nMemory at 0x0000 (interrupt vectors):');
        for (let row = 0; row < 4; row++) {
            const addr = row * 16;
            let hex = '';
            for (let i = 0; i < 16; i++) hex += bpl.readbyte(addr + i).toString(16).padStart(2,'0') + ' ';
            console.log(`  0x${addr.toString(16).padStart(4,'0')}: ${hex}`);
        }
    }
    
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
