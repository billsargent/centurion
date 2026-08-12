// Boot test v10: disassemble loop and trace I/O reads
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');

function termStr(bytes: number[]): string {
    return bytes.map(b => b & 0x7F).map(c => 
        c >= 32 && c < 127 ? String.fromCharCode(c) : 
        c === 0x0A ? '<LF>' : c === 0x0D ? '<CR>' : 
        c === 0x0C ? '<FF>' : `<${c.toString(16)}>`
    ).join('');
}

// Simple Nova/CPU-6 instruction decode
function decodeInstr(word: number, addr: number): string {
    const hi = (word >> 8) & 0xFF, lo = word & 0xFF;
    // Memory reference (bit 0 = 0)
    if ((word & 1) === 0) {
        const ac = (word >> 3) & 3;
        const idx = (word >> 6) & 3;
        const ind = (word >> 5) & 1;
        const disp = (word >> 8) & 0xFF;
        const op = word & 7;
        const ops = ['LDA','STA','','','JMP','JSR','ISZ','DSZ'];
        const o = ops[op] || `OP${op}`;
        const i = ind ? '@' : '';
        return `${o} ${i}${disp},${idx+1}`;
    }
    // ALU (bit 0 = 1, bits 1-2 != 00)
    if ((word & 6) !== 0) {
        return `ALU 0x${word.toString(16).toUpperCase()}`;
    }
    // I/O (bit 0 = 1, bits 1-2 = 00)
    const dev = (word >> 5) & 0x3F;
    const ac = (word >> 3) & 3;
    const op = word & 7;
    const ioOps = ['','NIO','DIA','DOA','','DIB','DOB','','DIC','DOC','','DID','DOD','','DIE','DOE','','DIF','DOF'];
    return `IO ${ioOps[op]||op} DEV=${dev} AC${ac}`;
}

async function main() {
    console.log('=== Boot Test v10 (loop disassembly) ===\n');
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
    const finch = g.window?.io_ffc;
    const bpl = g.window?.bpl;
    const mux = g.window?.io_mux;

    if (dsk2?.units?.[1]) { dsk2.units[1].image = diskImage; console.log('Disk on Unit 1'); }
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 2 | 8;

    // Capture backplane MUX writes and actual MUX TX output
    const termOut: number[] = [];
    const muxOutput: number[] = [];
    const capture: any = {
        emu_linked: true, rts: true, name: 'capture',
        receive: (c: number) => { muxOutput.push(c); },
        can_receive: () => true,
        check_send: () => {},
        bind_dev: () => {},
        get_dev: () => undefined,
        set_cts: () => {},
    };
    if (mux?.muxports?.[0]) {
        mux.muxports[0].bind_dev(capture);
        console.log('MUX capture device bound to port 0');
    }
    const dsk2Cmds: string[] = [];
    const ioReads: string[] = [];
    let seekForced = false;
    let loopDetected = false;

    const origRead = bpl.readbyte.bind(bpl);
    const origWrite = bpl.writebyte.bind(bpl);

    // Trace first DMA writes to find where sector data goes
    let dmaTrace: {addr:number,val:number,wa:number,ma:number,pa:number,pc:number}[] = [];
    
    bpl.writebyte = (addr: number, val: number) => {
        if (!(addr >= 0x3F000 && addr <= 0x3FFFF) && dmaTrace.length < 20) {
            dmaTrace.push({
                addr, val,
                wa: mcsim.workaddr, ma: mcsim.memaddr, pa: mcsim.physaddr,
                pc: mcsim.pc,
            });
        }
        if (addr >= 0x3F140 && addr <= 0x3F14F) {
            if (addr === 0x3F148) {
                const cmdNames = ['READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
                dsk2Cmds.push(`CMD ${cmdNames[val&7]||val} at PC=0x${mcsim.pc.toString(16).toUpperCase()}`);
                if (val === 3 && !seekForced && dsk2) { dsk2.busy_time = 1; seekForced = true; }
            }
        }
        if (addr === 0x3F201) termOut.push(val);
        return origWrite(addr, val);
    };

    // Trace I/O reads during loop
    bpl.readbyte = (addr: number) => {
        const val = origRead(addr);
        if (loopDetected && addr >= 0x3F000 && addr <= 0x3FFFF && ioReads.length < 200) {
            const pc = mcsim.pc;
            const ma = mcsim.memaddr || 0;
            const pa = mcsim.physaddr || 0;
            const wa = mcsim.workaddr || 0;
            ioReads.push(`PC=0x${pc.toString(16).toUpperCase()} MA=0x${ma.toString(16).toUpperCase()} PA=0x${pa.toString(16).toUpperCase()} WA=0x${wa.toString(16).toUpperCase()} RD 0x${addr.toString(16).toUpperCase()}=0x${val.toString(16).padStart(2,'0')}`);
        }
        return val;
    };

    mcsim.reset();
    if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
    // Set the RTC guard to block interrupts during early boot
    if (g.window) (g.window as any).__rtcGuard = true;
    mcsim.hspre();

    const input = 'H1\r';
    let sent = 0, lastBusy = false, idle = 0;
    const port0 = mux?.muxports?.[0];
    const start = Date.now();
    let pcHistory: number[] = [];
    let lastPC = mcsim.pc;
    let dmaCount = 0;
    let lastLogTime = 0;

    while (Date.now() - start < 30000) {
        const elapsed = Date.now() - start;
        // Log progress every 2 seconds
        if (elapsed - lastLogTime > 2000) {
            lastLogTime = elapsed;
            const pc = mcsim.pc;
            const lvl = mcsim.level;
            console.log(`  [${(elapsed/1000).toFixed(0)}s] PC=0x${pc.toString(16).toUpperCase()} LVL=${lvl} DMA=${dmaCount} dsk2.busy=${dsk2?.busy} dsk2.cmd=${dsk2?.command}`);
        }
        if (mux?.muxports) for (const p of mux.muxports) { if (p?.run_tx) try { p.run_tx(); } catch {} }
        const hwList = g.window?.__runHW;
        if (hwList) { for (const d of hwList) { if (d?.run) try { d.run(1); } catch {} } }
        else { if (dsk2?.run) dsk2.run(1); if (finch?.run) finch.run(1); }
        const hshwList = g.window?.__runHSHW;
        if (hshwList) { for (const d of hshwList) { if (d?.run) try { d.run(5); } catch {} } }
        for (let i = 0; i < 50; i++) { mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); }

        if (port0 && sent < input.length) {
            const busy = port0.read_busy;
            if (!busy && lastBusy) idle = 0;
            if (!busy) idle++;
            if (!busy && idle >= 5) { port0.receive(input.charCodeAt(sent)); sent++; idle = 0; }
            lastBusy = busy;
        }

        if (dsk2 && dsk2.dma_op !== 0) dmaCount++;

        const pc = mcsim.pc;
        if (pc !== lastPC) { lastPC = pc; pcHistory.push(pc); }

        // Detect loop: PC in 0x670-0x67F range
        if (pc >= 0x670 && pc <= 0x680 && !loopDetected && pcHistory.length > 100) {
            loopDetected = true;
            console.log('Loop detected, enabling I/O trace...');
        }

        // Extend: run to 30s max
    }
    mcsim.hsend();

    // Dump loaded memory as 16-bit big-endian words
    console.log(`\nLoaded code at 0x0670 (16-bit words):`);
    for (let addr = 0x670; addr < 0x6A0; addr += 2) {
        const w = (bpl.readbyte(addr) << 8) | bpl.readbyte(addr + 1);
        console.log(`  0x${addr.toString(16).toUpperCase()}: ${w.toString(16).padStart(4,'0').toUpperCase()}  ${decodeInstr(w, addr)}`);
    }

    console.log(`\nTerminal (backplane trace): ${termStr(termOut)}`);
    console.log(`Terminal (MUX output): ${termStr(muxOutput)}`);
    console.log(`\nDMA write trace (first ${dmaTrace.length} writes to non-I/O addresses):`);
    for (const d of dmaTrace) {
        console.log(`  phys=0x${d.addr.toString(16).toUpperCase()} val=0x${String(d.val).padStart(2,'0')} workaddr=0x${String(d.wa).padStart(4,'0')} memaddr=0x${String(d.ma).padStart(4,'0')} physaddr=0x${String(d.pa).padStart(4,'0')} PC=0x${d.pc.toString(16).toUpperCase()}`);
    }
    
    // Dump address 0 to see if sector 0 was loaded there
    if (bpl) {
        const a0 = bpl.readbyte(0);
        const a1 = bpl.readbyte(1);
        console.log(`\nAddress 0: ${a0.toString(16).padStart(2,'0')} ${a1.toString(16).padStart(2,'0')} (expected: 01 01 from sector 0)`);
    }
    console.log(`DSK2 Commands: ${dsk2Cmds.length}, DMA cycles: ${dmaCount}`);
    console.log(`DSK2 state: busy=${dsk2?.busy} cmd=${dsk2?.command}`);
    for (const c of dsk2Cmds) console.log(`  ${c}`);

    console.log(`\nI/O reads during loop (${ioReads.length}):`);
    // Show unique addresses
    const uniqAddrs = new Set<string>();
    for (const r of ioReads) {
        const m = r.match(/RD (0x[0-9A-F]+)=/);
        if (m) uniqAddrs.add(m[1]);
    }
    console.log(`  Unique I/O addresses: ${[...uniqAddrs].sort().join(', ')}`);
    // Show first 30 reads
    for (const r of ioReads.slice(0, 30)) console.log(`  ${r}`);

    console.log('\n=== Done ===');
    // Extra: dump address 0 (where JMP 0 lands) and 0x0500 area
    if (bpl) {
        console.log('\nMemory at 0x0000 (JMP 0 target):');
        let hex = '';
        for (let i = 0; i < 32; i++) {
            hex += bpl.readbyte(i).toString(16).padStart(2,'0') + ' ';
        }
        console.log('  ' + hex);

        console.log('\nMemory at 0x0500 (halt area):');
        for (let row = 0; row < 4; row++) {
            const addr = 0x500 + row * 16;
            let hex = '';
            for (let i = 0; i < 16; i++) {
                const b = bpl.readbyte(addr + i);
                hex += b.toString(16).padStart(2,'0') + ' ';
            }
            console.log(`  0x${addr.toString(16).toUpperCase()}: ${hex}`);
        }
    }
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
