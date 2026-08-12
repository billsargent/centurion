// ============================================================
// Server-bind test — replicates server.ts's MUX→terminal binding
// in-process to see why D= never reaches the telnet terminal.
// ============================================================
import { CoreEmulator } from '../core/emulator';

// A CharDevice that logs what the MUX sends it
class LogDev {
    emu_linked = true;
    rts = true;
    name = 'LogDev';
    read_busy = false;
    received: number[] = [];
    receive(c: number): void { this.received.push(c & 0x7F); }
    can_receive(): boolean { return true; }
    check_send(): void {}
    get_dev(): any { return undefined; }
    bind_dev(_d: any): void {}
    set_cts(_v: boolean): void {}
}

async function main() {
    console.log('=== Server-bind test ===\n');
    const emulator = new CoreEmulator();
    emulator.reset();

    const g = global as any;
    const mux = g.window?.io_mux;
    const port0 = mux?.muxports?.[0];
    if (!port0) { console.error('[FAIL] no MUX port 0'); process.exit(1); }

    // 1. Hook write_data to log EVERY byte the ROM writes to the MUX
    const rawOut: number[] = [];
    const origWD = port0.write_data.bind(port0);
    port0.write_data = (v: number) => { rawOut.push(v & 0x7F); return origWD(v); };

    // 2. Bind a logging device exactly like server.ts binds the terminal
    const dev = new LogDev();
    port0.bind_dev(dev);
    console.log('[OK] Bound LogDev to MUX port 0');
    console.log(`[OK] port0.get_dev() === dev? ${port0.get_dev() === dev}`);

    emulator.start();

    const t0 = Date.now();
    while (Date.now() - t0 < 20000) {
        await new Promise(r => setTimeout(r, 200));
    }
    emulator.stop();

    const ascii = (arr: number[]) => arr.map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : `<${b.toString(16)}>`).join('');
    console.log(`\n[rawOut (ROM → MUX write_data)] ${rawOut.length} bytes:`);
    console.log('  ' + ascii(rawOut).slice(0, 300));
    console.log(`\n[dev.received (MUX → bound dev)] ${dev.received.length} bytes:`);
    console.log('  ' + ascii(dev.received).slice(0, 300));

    if (rawOut.includes(0x44) && rawOut.includes(0x3D)) {
        console.log('\n[OK] ROM produced D= on write_data');
    } else {
        console.log('\n[FAIL] ROM did NOT produce D= on write_data');
    }
    if (dev.received.includes(0x44) && dev.received.includes(0x3D)) {
        console.log('[OK] MUX forwarded D= to bound device');
    } else {
        console.log('[FAIL] MUX did NOT forward D= to bound device');
    }

    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
