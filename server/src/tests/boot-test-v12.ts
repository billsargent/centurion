// Boot test v12: wait for MUX configuration before sending input
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const MASK_TABLE = [0x1f, 0x3f, 0x7f, 0xff];

async function main() {
    console.log('=== Boot Test v12 (wait for MUX config) ===\n');
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
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 4 | 8; // S2=4(OpSys), S3=8(R/F) — CENTOS mode!

    let muxConfigured = false;
    let promptSeen = false;
    const muxOutput: number[] = [];

    // Hook MUX port 0
    if (mux?.muxports?.[0]) {
        const port0 = mux.muxports[0];
        const origWriteControl = port0.write_control.bind(port0);
        const origReceive = port0.receive.bind(port0);
        const origWriteData = port0.write_data.bind(port0);
        
        port0.write_control = (value: number) => {
            muxConfigured = true;
            const bitLen = (value >> 1) & 3;
            console.log(`  MUX: write_control=0x${value.toString(16).padStart(2,'0')} → _bit_len=${bitLen}`);
            return origWriteControl(value);
        };
        port0.receive = (data: number) => {
            const bl = port0._bit_len;
            const mask = MASK_TABLE[bl];
            const stored = data & (mask ?? 0);
            console.log(`  MUX: receive(0x${data.toString(16).padStart(2,'0')}='${String.fromCharCode(data)}') _bit_len=${bl} → stored=0x${stored.toString(16).padStart(2,'0')}`);
            return origReceive(data);
        };
        port0.write_data = (value: number) => {
            const ch = value & 0x7F;
            if (ch === 0x3D) promptSeen = true; // '='
            return origWriteData(value);
        };

        // Capture MUX TX output
        const capture: any = {
            emu_linked: true, rts: true, name: 'capture',
            receive: (c: number) => { muxOutput.push(c); },
            can_receive: () => true,
            check_send: () => {}, bind_dev: () => {}, get_dev: () => undefined, set_cts: () => {},
        };
        port0.bind_dev(capture);
    }

    const port0 = mux?.muxports?.[0];

    // Trace DSK2 commands AND all I/O accesses from boot code
    const dsk2Cmds: string[] = [];
    const allIOAccesses: string[] = [];
    const origWrite = bpl.writebyte.bind(bpl);
    const origBplRead = bpl.readbyte.bind(bpl);
    
    bpl.writebyte = (addr: number, val: number) => {
        if (addr === 0x3F148) {
            const cmdNames = ['','READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
            dsk2Cmds.push(`CMD ${cmdNames[val&7]||val} at PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
        }
        if (addr >= 0x3F000 && addr <= 0x3FFFF && allIOAccesses.length < 200) {
            allIOAccesses.push(`WR IO 0x${addr.toString(16).toUpperCase()}=0x${val.toString(16).padStart(2,'0')} PC=0x${mcsim.pc.toString(16).toUpperCase()} LVL=${mcsim.level}`);
        }
        return origWrite(addr, val);
    };
    
    bpl.readbyte = (addr: number) => {
        const val = origBplRead(addr);
        if (addr >= 0x3F000 && addr <= 0x3FFFF && allIOAccesses.length < 200) {
            allIOAccesses.push(`RD IO 0x${addr.toString(16).toUpperCase()}=0x${val.toString(16).padStart(2,'0')} PC=0x${mcsim.pc.toString(16).toUpperCase()} LVL=${mcsim.level}`);
        }
        return val;
    };

    mcsim.reset();
    if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
    if (g.window) (g.window as any).__rtcGuard = true;
    mcsim.hspre();

    const input = 'H1\r';
    let sent = 0;
    const start = Date.now();
    let lastLogTime = 0;
    let inputEnabled = false;

    while (Date.now() - start < 30000) {
        const elapsed = Date.now() - start;
        if (elapsed - lastLogTime > 2000) {
            lastLogTime = elapsed;
            const pc = mcsim.pc;
            console.log(`  [${(elapsed/1000).toFixed(0)}s] PC=0x${pc.toString(16).toUpperCase()} LVL=${mcsim.level} dsk2.busy=${dsk2?.busy} cmd=${dsk2?.command} muxConfig=${muxConfigured} prompt=${promptSeen} sent=${sent}`);
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

        // Send input ONLY after MUX is configured AND D= prompt seen
        if (!inputEnabled && muxConfigured && promptSeen) {
            inputEnabled = true;
            console.log('  >>> Input enabled (MUX configured, prompt seen)');
        }

        if (inputEnabled && port0 && sent < input.length) {
            if (!port0.read_busy) {
                const ch = input.charCodeAt(sent);
                port0.receive(ch);
                console.log(`  >>> Sent: '${input[sent]}' (0x${ch.toString(16)})`);
                sent++;
            }
        }

        // Break conditions
        if (dsk2Cmds.length >= 5) {
            console.log('\n  Boot progressing (DSK2 commands found)');
        }
    }
    mcsim.hsend();

    function termStr(bytes: number[]): string {
        return bytes.map(b => b & 0x7F).map(c => 
            c >= 32 && c < 127 ? String.fromCharCode(c) : 
            c < 32 ? `<${c.toString(16)}>` : `<${c.toString(16)}>`
        ).join('');
    }

    console.log(`\nMUX output: ${termStr(muxOutput)}`);
    console.log(`DSK2 Commands:`);
    for (const c of dsk2Cmds) console.log(`  ${c}`);
    console.log(`\nAll I/O accesses (first ${allIOAccesses.length}):`);
    for (const r of allIOAccesses.slice(0, 80)) console.log(`  ${r}`);
    
    // Dump key memory
    if (bpl) {
        console.log('\nMemory at 0x0000:');
        let hex = '';
        for (let i = 0; i < 16; i++) hex += bpl.readbyte(i).toString(16).padStart(2,'0') + ' ';
        console.log('  ' + hex);
        
        console.log('\nMemory at 0x0250 (wipl_test load area):');
        for (let row = 0; row < 4; row++) {
            const addr = 0x250 + row * 16;
            hex = '';
            for (let i = 0; i < 16; i++) hex += bpl.readbyte(addr + i).toString(16).padStart(2,'0') + ' ';
            console.log(`  0x${addr.toString(16)}: ${hex}`);
        }
    }
    
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
