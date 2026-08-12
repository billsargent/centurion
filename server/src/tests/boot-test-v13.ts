// Boot test v13: comprehensive I/O trace for CENTOS (S1=0) path
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const MASK_TABLE = [0x1f, 0x3f, 0x7f, 0xff];

// Pretty register names for DSK2
const DSK2_REG = ['sel_unit','cyl_hi','cyl_lo','wpmask','stat_hi','stat_lo','','','command','diag'];

function termStr(bytes: number[]): string {
    return bytes.map(b => b & 0x7F).map(c => 
        c >= 32 && c < 127 ? String.fromCharCode(c) : 
        c < 32 ? `<${c.toString(16)}>` : `<${c.toString(16)}>`
    ).join('');
}

async function main() {
    console.log('=== Boot Test v13 — CENTOS I/O Trace (S1=0) ===\n');
    if (!fs.existsSync(DISK_PATH)) { console.error('No disk'); process.exit(1); }
    const diskBuffer = fs.readFileSync(DISK_PATH);
    const arrayBuf = diskBuffer.buffer.slice(diskBuffer.byteOffset, diskBuffer.byteOffset + diskBuffer.length);
    const stride = diskBuffer.length === 6651904 ? 512 : 400;
    const diskImage = {
        type: 'hawk' as const, filename: 'CENTOS_13.IMG', stride,
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
    // CENTOS mode: S2(OpSys)=2 + S4(R/F)=8 → sense 10
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 10;
    console.log(`Sense switches: 0x${(10).toString(16)} (S2=OpSys + S4=R/F)`);

    // =========================================================
    // MUX hooks — detect configuration before sending input
    // =========================================================
    let muxConfigured = false;
    let promptSeen = false;
    const muxOutput: number[] = [];

    if (mux?.muxports?.[0]) {
        const port0 = mux.muxports[0];
        const origWC = port0.write_control.bind(port0);
        const origRecv = port0.receive.bind(port0);
        const origWD = port0.write_data.bind(port0);
        
        port0.write_control = (value: number) => {
            muxConfigured = true;
            const bitLen = (value >> 1) & 3;
            console.log(`  [MUX cfg] write_control=0x${value.toString(16)} → bits=${bitLen} mask=0x${MASK_TABLE[bitLen]?.toString(16)||'??'}`);
            return origWC(value);
        };
        port0.receive = (data: number) => {
            const bl = port0._bit_len;
            const mask = MASK_TABLE[bl];
            const stored = data & (mask ?? 0);
            console.log(`  [MUX in]  receive('${data>=32&&data<127?String.fromCharCode(data):'?'}') bits=${bl} → stored=0x${stored.toString(16)}`);
            return origRecv(data);
        };
        port0.write_data = (value: number) => {
            const ch = value & 0x7F;
            if (ch === 0x3D) promptSeen = true;
            return origWD(value);
        };

        const capture: any = {
            emu_linked: true, rts: true, name: 'capture',
            receive: (c: number) => { muxOutput.push(c); },
            can_receive: () => true,
            check_send: () => {}, bind_dev: () => {}, get_dev: () => undefined, set_cts: () => {},
        };
        port0.bind_dev(capture);
    }

    const port0 = mux?.muxports?.[0];

    // =========================================================
    // I/O trace — capture EVERY DSK2 access + summary of others
    // =========================================================
    let dsk2Writes: string[] = [];
    let dsk2Reads: string[] = [];
    let otherWrites: string[] = [];
    let otherReads: string[] = [];
    let pageTableHistory: string[] = [];

    const origRead = bpl.readbyte.bind(bpl);
    const origWrite = bpl.writebyte.bind(bpl);

    bpl.readbyte = (addr: number) => {
        const val = origRead(addr);
        const pc = mcsim.pc;
        const ma = mcsim.memaddr;
        const pa = mcsim.physaddr;
        const pgram = mcsim.pgram;
        const pgaddr7 = mcsim.pgaddr7;
        
        // DSK2: 0x3F140-0x3F14F
        if (addr >= 0x3F140 && addr <= 0x3F150) {
            const reg = addr - 0x3F140;
            dsk2Reads.push(`RD DSK2[${DSK2_REG[reg]||reg}] = 0x${val.toString(16).padStart(2,'0')} PC=0x${pc.toString(16).toUpperCase()} MA=0x${ma.toString(16).toUpperCase()} PA=0x${pa?.toString(16).toUpperCase()||'?'}`);
        }
        // MUX
        else if (addr >= 0x3F200 && addr <= 0x3F20F) {
            if (otherReads.length < 50) otherReads.push(`RD MUX[${addr-0x3F200}] = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        // ROM
        else if (addr >= 0x3FC00 && addr <= 0x3FFFF) {
            if (otherReads.length < 50) otherReads.push(`RD ROM[${addr-0x3FC00}] = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        // Other I/O
        else if (addr >= 0x3F000) {
            if (otherReads.length < 100) otherReads.push(`RD IO 0x${addr.toString(16).toUpperCase()} = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        
        return val;
    };

    bpl.writebyte = (addr: number, val: number) => {
        const pc = mcsim.pc;
        const ma = mcsim.memaddr;
        
        // DSK2: 0x3F140-0x3F150
        if (addr >= 0x3F140 && addr <= 0x3F150) {
            const reg = addr - 0x3F140;
            const cmdNames = ['READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
            const valStr = reg === 8 ? `**${cmdNames[val&7]||val}** (0x${val.toString(16)})` : `0x${val.toString(16).padStart(2,'0')}`;
            dsk2Writes.push(`WR DSK2[${DSK2_REG[reg]||reg}] = ${valStr} PC=0x${pc.toString(16).toUpperCase()} MA=0x${ma.toString(16).toUpperCase()}`);
        }
        // MUX
        else if (addr >= 0x3F200 && addr <= 0x3F20F) {
            if (otherWrites.length < 100) otherWrites.push(`WR MUX[${addr-0x3F200}] = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        // Other I/O
        else if (addr >= 0x3F000) {
            if (otherWrites.length < 100) otherWrites.push(`WR IO 0x${addr.toString(16).toUpperCase()} = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        // RAM writes from CENTOS code (low addresses may be boot sector loads)
        else if (addr < 0x1000 && (pc >= 0xFC00 || (pc < 0xFC00 && pc > 0x100))) {
            if (otherWrites.length < 200) otherWrites.push(`WR RAM 0x${addr.toString(16).toUpperCase()} = 0x${val.toString(16)} PC=0x${pc.toString(16).toUpperCase()}`);
        }
        
        return origWrite(addr, val);
    };

    // =========================================================
    // Run emulation
    // =========================================================
    mcsim.reset();
    if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
    if (g.window) (g.window as any).__rtcGuard = true;
    mcsim.hspre();

    const input = 'H1\r';
    let sent = 0;
    const start = Date.now();
    let lastLogTime = 0;
    let inputEnabled = false;
    let dmaCount = 0;

    while (Date.now() - start < 15000) {
        const elapsed = Date.now() - start;
        if (elapsed - lastLogTime > 2000) {
            lastLogTime = elapsed;
            const pc = mcsim.pc;
            const lvl = mcsim.level;
            const busy = dsk2?.busy;
            const cmd = dsk2?.command;
            console.log(`  [${(elapsed/1000).toFixed(0)}s] PC=0x${pc.toString(16).toUpperCase()} LVL=${lvl} DSK2:busy=${busy} cmd=${cmd} DMA=${dmaCount} dskWr=${dsk2Writes.length} dskRd=${dsk2Reads.length}`);
        }

        // Tick MUX TX
        if (mux?.muxports) for (const p of mux.muxports) { if (p?.run_tx) try { p.run_tx(); } catch {} }
        // Tick hardware
        const hwList = g.window?.__runHW;
        if (hwList) { for (const d of hwList) { if (d?.run) try { d.run(1); } catch {} } }
        const hshwList = g.window?.__runHSHW;
        if (hshwList) { for (const d of hshwList) { if (d?.run) try { d.run(5); } catch {} } }
        // HS steps — slower pace to capture more detail
        for (let i = 0; i < 10; i++) { mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); }

        // Count DMA operations
        if (dsk2?.dma_op !== 0) dmaCount++;

        // Send input only after MUX configured AND prompt seen
        if (!inputEnabled && muxConfigured && promptSeen) {
            inputEnabled = true;
            console.log('  >>> Input enabled');
        }

        if (inputEnabled && port0 && sent < input.length) {
            if (!port0.read_busy) {
                const ch = input.charCodeAt(sent);
                port0.receive(ch);
                sent++;
            }
        }
    }
    mcsim.hsend();

    // =========================================================
    // Report
    // =========================================================
    console.log(`\n━━━ MUX Output ━━━`);
    console.log(termStr(muxOutput));

    console.log(`\n━━━ DSK2 Commands (writes to cmd register) ━━━`);
    const cmdWrites = dsk2Writes.filter(w => w.includes('command'));
    if (cmdWrites.length === 0) console.log('  NONE!');
    else for (const w of cmdWrites) console.log(`  ${w}`);

    console.log(`\n━━━ DSK2 Register Reads ━━━`);
    if (dsk2Reads.length === 0) console.log('  NONE!');
    else for (const r of dsk2Reads) console.log(`  ${r}`);

    console.log(`\n━━━ DSK2 Register Writes ━━━`);
    for (const w of dsk2Writes) console.log(`  ${w}`);

    console.log(`\n━━━ Other I/O Writes ━━━`);
    for (const w of otherWrites.slice(0, 40)) console.log(`  ${w}`);
    if (otherWrites.length > 40) console.log(`  ... (${otherWrites.length} total)`);

    console.log(`\n━━━ Other I/O Reads ━━━`);
    for (const r of otherReads.slice(0, 40)) console.log(`  ${r}`);
    if (otherReads.length > 40) console.log(`  ... (${otherReads.length} total)`);

    // Memory dump
    if (bpl) {
        console.log(`\n━━━ Key Memory Areas ━━━`);
        console.log('0x0000-0x000F (vectors):');
        let hex = '';
        for (let i = 0; i < 16; i++) hex += bpl.readbyte(i).toString(16).padStart(2,'0') + ' ';
        console.log('  ' + hex);

        console.log('0x0100-0x01FF (WIPL entry):');
        for (let row = 0; row < 4; row++) {
            const addr = 0x100 + row * 16;
            hex = '';
            for (let i = 0; i < 16; i++) hex += bpl.readbyte(addr + i).toString(16).padStart(2,'0') + ' ';
            console.log(`  ${addr.toString(16).padStart(4,'0')}: ${hex}`);
        }

        console.log('0x0500-0x050F (abort handler area):');
        hex = '';
        for (let i = 0; i < 16; i++) hex += bpl.readbyte(0x500 + i).toString(16).padStart(2,'0') + ' ';
        console.log('  ' + hex);
    }

    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
