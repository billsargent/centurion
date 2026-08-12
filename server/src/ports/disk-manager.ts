// ============================================================
// Disk Management Telnet Port
// Menu-driven interface for loading, creating, exporting,
// and inspecting disk images (Hawk and Finch).
// ============================================================

import { TelnetSession } from '../telnet/server';
import {
    DiskImage, DiskContainer, DiskTemplate, DiskType,
    FINCH_TRACK, FINCH_PLAT,
} from '../../../shared/interfaces';
import {
    Color, fg, bg, ansiReset, bold, dim, reverse,
    cursorPos, cursorHome, clearScreen, cursorHide, cursorShow,
    hLine,
} from '../telnet/ansi';
import * as fs from 'fs';
import * as path from 'path';

export interface ManagedDisk {
    container: DiskContainer;
    image: DiskImage | null;
    label: string;
    type: 'dsk2' | 'finch';
    unitIndex: number;
}

export class DiskManagerSession {
    private session: TelnetSession;
    private disks: ManagedDisk[] = [];
    private diskDir: string;

    constructor(disks: ManagedDisk[], session: TelnetSession, diskDir: string = './disks') {
        this.disks = disks;
        this.session = session;
        this.diskDir = diskDir;

        // Ensure disks directory exists
        if (!fs.existsSync(diskDir)) {
            fs.mkdirSync(diskDir, { recursive: true });
        }

        session.onKey = (key: string, buf: string) => {
            // Simple menu navigation via single keystrokes
            this.handleKey(key);
        };

        session.onClose = () => {};

        this.showMenu();
    }

    private handleKey(key: string): void {
        switch (key.toLowerCase()) {
            case 'l': this.showLoadMenu(); break;
            case 'n': this.showNewDiskMenu(); break;
            case 'u': this.showUnmountMenu(); break;
            case 'i': this.showDiskInfo(); break;
            case 'm': this.showMenu(); break;
            case 'q':
                this.session.writeln(fg(Color.BRIGHT_YELLOW) + 'Disconnecting disk manager...' + ansiReset());
                this.session.close();
                break;
            case '0': case '1': case '2': case '3':
            case '4': case '5': case '6': case '7':
                this.mountExisting(parseInt(key));
                break;
            default:
                break;
        }
    }

    private showMenu(): void {
        let out = '';
        out += clearScreen() + cursorHome() + cursorHide();

        // Title
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  CENTURION CPU-6  │  Disk Management  │  [M]enu [L]oad [N]ew [E]xport [I]nfo [Q]uit  ';
        out += ansiReset() + '\r\n\r\n';

        // Disk status overview
        out += fg(Color.BRIGHT_WHITE) + bold() + '  MOUNTED DISKS' + ansiReset() + '\r\n';
        out += hLine(3, 2, 76) + '\r\n';

        for (let i = 0; i < this.disks.length; i++) {
            const d = this.disks[i];
            out += cursorPos(4 + i, 2);
            const num = `[${i}]`;
            out += bold() + fg(Color.BRIGHT_CYAN) + num + ansiReset() + ' ';

            if (d.image) {
                const sizeMB = (d.image.backing_data.byteLength / (1024 * 1024)).toFixed(1);
                const typeStr = d.image.type.toUpperCase();
                const protStr = d.image.protect ? fg(Color.RED) + 'WP' + ansiReset() : fg(Color.GREEN) + 'RW' + ansiReset();
                out += fg(Color.BRIGHT_GREEN) + d.image.filename.padEnd(30) + ansiReset();
                out += fg(Color.BRIGHT_BLACK) + ` ${typeStr.padEnd(6)} ${sizeMB.padStart(8)}MB  ${protStr}` + ansiReset();
            } else {
                out += dim() + fg(Color.BRIGHT_BLACK) +
                    `(empty - ${d.label})`.padEnd(40) +
                    `${d.type.toUpperCase().padEnd(6)}` + ansiReset();
            }
        }
        out += '\r\n\r\n';

        // Commands
        out += fg(Color.BRIGHT_WHITE) + bold() + '  COMMANDS' + ansiReset() + '\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [L]' + ansiReset() + ' Load disk image into a drive\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [N]' + ansiReset() + ' Create new blank disk image\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [E]' + ansiReset() + ' Export (download) disk image\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [I]' + ansiReset() + ' Show detailed disk information\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [0-7]' + ansiReset() + ' Quick-mount from disks/ directory\r\n';
        out += fg(Color.BRIGHT_CYAN) + '  [U]' + ansiReset() + ' Unmount (eject) a disk\r\n';

        this.session.write(out);
    }

    private showLoadMenu(): void {
        let out = clearScreen() + cursorHome();
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  LOAD DISK IMAGE  │  Select drive and file  ';
        out += ansiReset() + '\r\n\r\n';

        // List available disk files
        out += fg(Color.BRIGHT_WHITE) + '  Available disk images in ' + this.diskDir + ':' + ansiReset() + '\r\n';

        try {
            const files = fs.readdirSync(this.diskDir)
                .filter(f => f.endsWith('.IMG') || f.endsWith('.FFI') || f.endsWith('.img') || f.endsWith('.ffi'))
                .sort();

            if (files.length === 0) {
                out += dim() + '  (no disk images found)' + ansiReset() + '\r\n';
            } else {
                for (let i = 0; i < Math.min(files.length, 20); i++) {
                    const f = files[i];
                    const stats = fs.statSync(path.join(this.diskDir, f));
                    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
                    const num = i.toString().padStart(2);
                    out += fg(Color.BRIGHT_CYAN) + `  [${num}]` + ansiReset();
                    out += ` ${f.padEnd(35)} ${sizeMB.padStart(8)}MB\r\n`;
                }
            }
        } catch {
            out += fg(Color.RED) + '  Error reading disk directory' + ansiReset() + '\r\n';
        }

        out += '\r\n' + fg(Color.BRIGHT_BLACK) + '  [M] Back to menu' + ansiReset();

        this.session.write(out);
    }

    private mountExisting(index: number): void {
        try {
            const files = fs.readdirSync(this.diskDir)
                .filter(f => f.endsWith('.IMG') || f.endsWith('.FFI') || f.endsWith('.img') || f.endsWith('.ffi'))
                .sort();

            if (index < 0 || index >= files.length) {
                this.session.writeln(fg(Color.RED) + 'Invalid disk index' + ansiReset());
                return;
            }

            const filePath = path.join(this.diskDir, files[index]);
            const stats = fs.statSync(filePath);
            const buffer = fs.readFileSync(filePath);
            const arrayBuf = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

            // Determine disk type from extension and stride. Hawk stride depends
            // on image size: 6651904 → 512, 5196800 → 400 (CENTOS_12/13 are 512).
            const isFinch = filePath.toUpperCase().endsWith('.FFI');
            const stride = isFinch
                ? FINCH_TRACK
                : (buffer.length === 6651904 ? 512 : buffer.length === 5196800 ? 400 : 512);

            const image: DiskImage = {
                type: isFinch ? 'finch' : 'hawk',
                filename: files[index],
                stride,
                backing_data: arrayBuf,
                protect: false,
                data: new Uint8Array(arrayBuf),
            };

            // Mount to first available compatible drive.
            // For DSK2/Hawk, prefer unit 1 (Centurion "H1" convention)
            let mounted = false;
            const candidates = [...this.disks];
            if (!isFinch) {
                // Sort: Hawk unit 1 before unit 0
                candidates.sort((a, b) => {
                    if (a.type === 'dsk2' && b.type === 'dsk2') return b.unitIndex - a.unitIndex;
                    return 0;
                });
            }
            for (const disk of candidates) {
                if (!disk.image && disk.type === (isFinch ? 'finch' : 'dsk2')) {
                    disk.container.set_disk(image);
                    disk.image = image;
                    mounted = true;
                    this.session.writeln(
                        fg(Color.BRIGHT_GREEN) +
                        `Mounted ${files[index]} to ${disk.label}` +
                        ansiReset()
                    );
                    break;
                }
            }

            if (!mounted) {
                this.session.writeln(fg(Color.RED) + 'No compatible empty drive available' + ansiReset());
            }

            setTimeout(() => this.showMenu(), 2000);
        } catch (err: any) {
            this.session.writeln(fg(Color.RED) + `Error: ${err.message}` + ansiReset());
        }
    }

    private showNewDiskMenu(): void {
        let out = clearScreen() + cursorHome();
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  CREATE NEW DISK  ';
        out += ansiReset() + '\r\n\r\n';

        const templates = [
            { label: 'Hawk 400B sectors (5MB)', kind: 'hawk' as DiskType, stride: 400, size: 5196800 },
            { label: 'Hawk 512B sectors (6.5MB)', kind: 'hawk' as DiskType, stride: 512, size: 6651904 },
            { label: 'Finch 1-platter (8MB)', kind: 'finch' as DiskType, stride: FINCH_TRACK, size: FINCH_PLAT },
            { label: 'Finch 2-platter (16MB)', kind: 'finch' as DiskType, stride: FINCH_TRACK, size: FINCH_PLAT * 2 },
            { label: 'Finch 4-platter (32MB)', kind: 'finch' as DiskType, stride: FINCH_TRACK, size: FINCH_PLAT * 4 },
        ];

        for (let i = 0; i < templates.length; i++) {
            const t = templates[i];
            const sizeMB = (t.size / (1024 * 1024)).toFixed(1);
            out += fg(Color.BRIGHT_CYAN) + `  [${i}]` + ansiReset();
            out += ` ${t.label.padEnd(30)} ${sizeMB.padStart(8)}MB\r\n`;
        }

        out += '\r\n' + fg(Color.BRIGHT_BLACK);
        out += '  New disk creation not yet implemented in Telnet interface.\r\n';
        out += '  Use the browser UI or create disk files manually.\r\n';
        out += '  [M] Back to menu' + ansiReset();

        this.session.write(out);
    }

    private showExportMenu(): void {
        let out = clearScreen() + cursorHome();
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  EXPORT DISK IMAGE  ';
        out += ansiReset() + '\r\n\r\n';

        let hasMounted = false;
        for (let i = 0; i < this.disks.length; i++) {
            const d = this.disks[i];
            if (d.image) {
                hasMounted = true;
                out += fg(Color.BRIGHT_CYAN) + `  [${i}]` + ansiReset();
                out += ` ${d.image.filename} (${d.label})\r\n`;
            }
        }

        if (!hasMounted) {
            out += dim() + '  No disks mounted to export' + ansiReset() + '\r\n';
        }

        out += '\r\n' + fg(Color.BRIGHT_BLACK);
        out += '  [M] Back to menu' + ansiReset();

        this.session.write(out);
    }

    private showUnmountMenu(): void {
        let hasMounted = false;
        for (let i = 0; i < this.disks.length; i++) {
            const d = this.disks[i];
            if (d.image) {
                hasMounted = true;
                // Unmount: clear image from container
                d.container.set_disk(null);
                d.image = null;
                this.session.writeln(fg(Color.BRIGHT_YELLOW) + `Unmounted ${d.label}` + ansiReset());
            }
        }
        if (!hasMounted) {
            this.session.writeln(dim() + 'No disks mounted.' + ansiReset());
        }
        setTimeout(() => this.showMenu(), 1500);
    }

    private showDiskInfo(): void {
        let out = clearScreen() + cursorHome();
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  DISK INFORMATION  ';
        out += ansiReset() + '\r\n\r\n';

        for (let i = 0; i < this.disks.length; i++) {
            const d = this.disks[i];
            out += fg(Color.BRIGHT_WHITE) + bold() + `  Drive ${i}: ${d.label}` + ansiReset() + '\r\n';
            out += `    Type: ${d.type.toUpperCase()}\r\n`;

            if (d.image) {
                const size = d.image.backing_data.byteLength;
                out += `    Image: ${d.image.filename}\r\n`;
                out += `    Size: ${size} bytes (${(size / 1024 / 1024).toFixed(2)} MB)\r\n`;
                out += `    Stride: ${d.image.stride} bytes/sector\r\n`;
                out += `    Sectors: ${Math.floor(size / d.image.stride)}\r\n`;
                out += `    Protected: ${d.image.protect ? 'Yes' : 'No'}\r\n`;
            } else {
                out += dim() + '    (no disk mounted)' + ansiReset() + '\r\n';
            }
            out += '\r\n';
        }

        out += fg(Color.BRIGHT_BLACK) + '  [M] Back to menu' + ansiReset();
        this.session.write(out);
    }
}
