// Quick sense switch sweep test
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

installPolyfills();

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');

async function testCombo(ss: number, desc: string, input: string) {
    const diskBuffer = fs.readFileSync(DISK_PATH);
    const arrayBuf = diskBuffer.buffer.slice(diskBuffer.byteOffset, diskBuffer.byteOffset + diskBuffer.length);
    const diskImage = {
        type: 'hawk' as const, filename: 'CENTOS_13.IMG', stride: 400,
        backing_data: arrayBuf, protect: false, data: new Uint8Array(arrayBuf),
    };

    // Need fresh load each time since cen.js global state can't be reset
    const cenJsPath = path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js');
    
    const g = global as any;
    // Only load once
    if (!g.window?.cpu) {
        loadAMDModule(cenJsPath);
    }

    const cpu = g.window?.cpu;
    const dsk2 = g.window?.io_dsk2;
    const mux = g.window?.io_mux;
    
    if (dsk2?.units?.[1]) dsk2.units[1].image = diskImage;
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = ss;

    const out: number[] = [];
    let cfg = false, prompt = false;
    const c: any = {emu_linked:true,rts:true,name:'x',receive:(c:number)=>out.push(c),can_receive:()=>true,check_send:()=>{},bind_dev:()=>{},get_dev:()=>undefined,set_cts:()=>{}};
    if (mux?.muxports?.[0]) mux.muxports[0].bind_dev(c);
    const owc = mux.muxports[0].write_control.bind(mux.muxports[0]);
    mux.muxports[0].write_control = (v:number) => {cfg=true;return owc(v)};
    const owd = mux.muxports[0].write_data.bind(mux.muxports[0]);
    mux.muxports[0].write_data = (v:number) => {if((v&0x7F)===0x3D)prompt=true;return owd(v)};
    
    cpu.reset(); g.window.__runOnce=true; g.window.__rtcGuard=true; cpu.hspre();
    const t0 = Date.now(); let ie = false, sent = 0;
    
    while (Date.now() - t0 < 6000) {
        if (mux?.muxports) for (const p of mux.muxports) { if (p?.run_tx) try {p.run_tx()} catch {} }
        const hw = g.window?.__runHW; if (hw) for (const d of hw) { if (d?.run) try {d.run(1)} catch {} }
        const hw2 = g.window?.__runHSHW; if (hw2) for (const d of hw2) { if (d?.run) try {d.run(5)} catch {} }
        for (let i = 0; i < 10; i++) { cpu.hsstep(); cpu.hsstep(); cpu.hsstep(); cpu.hsstep(); cpu.hsstep(); }
        if (!ie && cfg && prompt) { ie = true; }
        if (ie && out.length > 0 && sent < input.length && !mux.muxports[0].read_busy) {
            mux.muxports[0].receive(input.charCodeAt(sent)); sent++;
        }
        if (sent >= input.length && mux.muxports[0] && !mux.muxports[0].read_busy && out.length > 0) {
            // Input sent, wait a bit more
            if (Date.now() - t0 > 3000) break;
        }
    }
    cpu.hsend();
    const s = out.map(b=>b&0x7F).map(c=>c>=32&&c<127?String.fromCharCode(c):c<32?'<'+c.toString(16)+'>':'').join('').substring(0,150);
    return `SS=${ss.toString().padStart(2)} ${desc.padEnd(12)} PC=0x${cpu.pc.toString(16).toUpperCase()} LVL=${cpu.level} | ${s}`;
}

async function main() {
    console.log('=== Sense Switch Sweep ===\n');
    
    const combos = [
        {ss:0, desc:'none'},
        {ss:8, desc:'S3(R/F)'},
        {ss:9, desc:'S0+S3'},
        {ss:10, desc:'S1+S3'},
        {ss:11, desc:'S0+S1+S3'},
        {ss:15, desc:'ALL'},
    ];
    
    for (const combo of combos) {
        const r = await testCombo(combo.ss, combo.desc, 'H1\r');
        console.log(r);
    }
    
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
