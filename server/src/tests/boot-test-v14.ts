// Boot test v14: trace DSK2 run/tickbusy to debug seek completion
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');

async function main() {
    console.log('=== Boot Test v14 — DSK2 run/tick trace ===\n');
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

    if (dsk2?.units?.[1]) { dsk2.units[1].image = diskImage; }
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 8; // S3=R/F only
    console.log(`Sense: 0x8 (S3=R/F only, CENTOS mode)`);

    // =========================================================
    // Hook DSK2 run() and tickbusy() to trace seek progress
    // =========================================================
    if (dsk2) {
        const origRun = dsk2.run.bind(dsk2);
        const origTick = dsk2.tickbusy.bind(dsk2);
        let tickCount = 0;
        let lastBT = -1;
        
        dsk2.tickbusy = function() {
            tickCount++;
            const prevBT = dsk2.busy_time;
            origTick();
            if (dsk2.busy_time !== prevBT - 1 && dsk2.busy_time > 0) {
                console.log(`  [DSK2 TICK] busy_time went from ${prevBT} to ${dsk2.busy_time} (UNEXPECTED!)`);
            }
            if (dsk2.busy_time === 0 && dsk2.seeking) {
                console.log(`  [DSK2 TICK] seek completing! tickCount=${tickCount} seeking=${dsk2.seeking}->false`);
            }
        };
        
        dsk2.run = function(inc: number) {
            const bt_before = dsk2.busy_time;
            const seeking_before = dsk2.seeking;
            const busy_before = dsk2.busy;
            origRun(inc);
            const bt_after = dsk2.busy_time;
            
            if (bt_before > 0 && bt_after === bt_before) {
                // busy_time didn't decrement! Something is wrong.
                console.log(`  [DSK2 RUN] STUCK! inc=${inc} busy_time=${bt_before}→${bt_after} busy=${busy_before} seeking=${seeking_before} cmd=${dsk2.command}`);
            }
        };
    }

    // =========================================================
    // MUX hooks
    // =========================================================
    let muxConfigured = false, promptSeen = false;
    if (mux?.muxports?.[0]) {
        const port0 = mux.muxports[0];
        const origWC = port0.write_control.bind(port0);
        port0.write_control = (value: number) => { muxConfigured = true; return origWC(value); };
        const origWD = port0.write_data.bind(port0);
        port0.write_data = (value: number) => { if ((value & 0x7F) === 0x3D) promptSeen = true; return origWD(value); };
    }

    // =========================================================
    // DSK2 command trace
    // =========================================================
    const cmds: string[] = [];
    const origWrite = bpl.writebyte.bind(bpl);
    bpl.writebyte = (addr: number, val: number) => {
        if (addr === 0x3F148) {
            const names = ['READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
            const pc = mcsim.pc;
            cmds.push(`CMD ${names[val&7]||val} PC=0x${pc.toString(16).toUpperCase()} unit=${dsk2?.sel_unit} busy=${dsk2?.busy} seeking=${dsk2?.seeking} seek_done=${dsk2?.seek_done}`);
        }
        return origWrite(addr, val);
    };

    // =========================================================
    // Run
    // =========================================================
    mcsim.reset();
    if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
    if (g.window) (g.window as any).__rtcGuard = true;
    mcsim.hspre();

    const port0 = mux?.muxports?.[0];
    const input = 'H1\r';
    let sent = 0, inputEnabled = false;
    const start = Date.now();
    let lastLog = 0;

    while (Date.now() - start < 12000) {
        const elapsed = Date.now() - start;
        if (elapsed - lastLog > 2000) {
            lastLog = elapsed;
            console.log(`  [${(elapsed/1000).toFixed(0)}s] PC=0x${mcsim.pc.toString(16).toUpperCase()} LVL=${mcsim.level} bt=${dsk2?.busy_time} seeking=${dsk2?.seeking} seek_done=${dsk2?.seek_done} stat_lo=0x${(dsk2?.readbyte(5)??0).toString(16)}`);
        }

        if (mux?.muxports) for (const p of mux.muxports) { if (p?.run_tx) try { p.run_tx(); } catch {} }
        const hwList = g.window?.__runHW;
        if (hwList) { for (const d of hwList) { if (d?.run) try { d.run(1); } catch {} } }
        const hshwList = g.window?.__runHSHW;
        if (hshwList) { for (const d of hshwList) { if (d?.run) try { d.run(5); } catch {} } }
        for (let i = 0; i < 10; i++) { mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); mcsim.hsstep(); }

        if (!inputEnabled && muxConfigured && promptSeen) {
            inputEnabled = true; console.log('  >>> Input enabled');
        }
        if (inputEnabled && port0 && sent < input.length && !port0.read_busy) {
            port0.receive(input.charCodeAt(sent)); sent++;
        }

        if (dsk2?.busy_time === 0 && dsk2?.seeking === false && dsk2?.seek_done === true && cmds.length >= 3 && mcsim.pc >= 0x100 && mcsim.pc < 0x200) {
            console.log('\n  Seek completed in WIPL! Continuing...');
        }
    }
    mcsim.hsend();

    console.log(`\n━━━ DSK2 Commands ━━━`);
    for (const c of cmds) console.log(`  ${c}`);
    console.log(`\nFinal: busy_time=${dsk2?.busy_time} seeking=${dsk2?.seeking} seek_done=${dsk2?.seek_done} sel_unit=${dsk2?.sel_unit}`);
    
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
