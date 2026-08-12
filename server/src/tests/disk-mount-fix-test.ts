// Verify disk-mount fixes: auto-mount reflects in getAllDiskUnits / disk manager,
// stride is 512 for CENTOS_13, and stub set_disk syncs both stub + real unit.
import { CoreEmulator } from '../core/emulator';

async function main() {
    console.log('=== Disk mount fixes verification ===\n');
    const emulator = new CoreEmulator();
    emulator.reset();

    const g = global as any;
    const realDsk2 = g.window?.io_dsk2;

    // 1. Auto-mount should be visible through getAllDiskUnits (disk-manager display fix)
    const units = emulator.getAllDiskUnits();
    console.log('[getAllDiskUnits]');
    for (const u of units) {
        console.log(`  [${u.unitIndex}] ${u.label}: ${u.image ? u.image.filename + ' (stride ' + u.image.stride + ')' : '(empty)'}`);
    }

    const unit1 = units.find(u => u.type === 'dsk2' && u.unitIndex === 1);
    if (unit1 && unit1.image?.filename === 'CENTOS_13.IMG' && unit1.image.stride === 512) {
        console.log('\n[OK] Auto-mount reflected in getAllDiskUnits with stride 512');
    } else {
        console.log('\n[FAIL] getAllDiskUnits does not show CENTOS_13 stride 512');
    }

    // 2. Real unit matches
    const realImg = realDsk2?.units?.[1]?.image;
    console.log(`[real dsk2.units[1].image] ${realImg ? realImg.filename + ' stride ' + realImg.stride : 'NONE'}`);

    // 3. Stub set_disk syncs both
    console.log('\n[stub set_disk sync test]');
    if (unit1) {
        unit1.container.set_disk(null); // eject
        const after = emulator.getAllDiskUnits();
        const u1a = after.find(u => u.type === 'dsk2' && u.unitIndex === 1);
        const realAfter = realDsk2.units[1].image;
        console.log(`  after eject: mgr=${u1a?.image === null ? 'empty' : 'set'}, real=${realAfter === null ? 'empty' : 'set'}`);
        if (u1a?.image === null && realAfter === null) {
            console.log('  [OK] eject syncs both');
        } else {
            console.log('  [FAIL] eject did not sync');
        }
    }

    emulator.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
