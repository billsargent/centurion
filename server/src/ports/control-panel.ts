// ============================================================
// Control Panel Telnet Port
// Renders the Centurion front panel (registers, LEDs, status)
// in ANSI text, refreshed at ~10Hz for LED activity simulation.
// ============================================================

import { TelnetSession } from '../telnet/server';
import {
    ICCPU, MicroStepCPU, DisplayState,
} from '../../../shared/interfaces';
import { CoreEmulator } from '../core/emulator';
import {
    CSI, Color, fg, bg, ansiReset, bold, dim, reverse, blink,
    cursorPos, cursorHome, clearScreen, cursorHide,
    drawBox, hLine, led, ledLevel,
    hex1, hex2, hex4, hex5,
} from '../telnet/ansi';

export class ControlPanelSession {
    private cpu: ICCPU;
    private mstep: MicroStepCPU | null;
    private session: TelnetSession;
    private emulator: CoreEmulator;
    private refreshInterval: NodeJS.Timeout | null = null;
    private dirty = true;
    private lastRegFile = new Uint16Array(128);
    private regDirty = true;
    private helpMode = false;

    constructor(cpu: ICCPU, mstep: MicroStepCPU | null, session: TelnetSession, emulator: CoreEmulator) {
        this.cpu = cpu;
        this.mstep = mstep;
        this.session = session;
        this.emulator = emulator;

        // Override key handler for control panel commands
        const origOnKey = session.onKey;
        session.onKey = (key: string, buf: string) => {
            this.handleCommand(key);
        };

        session.onClose = () => this.stop();

        this.start();
    }

    private handleCommand(key: string): void {
        // If help mode is active, any key dismisses it (except h/?/H reshow)
        if (this.helpMode) {
            const k = key.toLowerCase();
            if (k !== 'h' && k !== '?') {
                this.helpMode = false;
                this.dirty = true;
            }
        }
        switch (key.toLowerCase()) {
            case 's':
                this.emulator.step(true);
                this.dirty = true;
                this.regDirty = true;
                this.render();
                break;
            case 'r':
                if (this.emulator.isRunning) {
                    this.emulator.stop();
                    this.session.writeln(fg(Color.BRIGHT_RED) + 'Emulation halted' + ansiReset());
                } else {
                    this.emulator.start();
                    this.session.writeln(fg(Color.BRIGHT_GREEN) + 'Emulation running...' + ansiReset());
                }
                this.dirty = true;
                this.render();
                break;
            case '1': this.emulator.runRate = 1; this.showRateChange(1); break;
            case '2': this.emulator.runRate = 10; this.showRateChange(10); break;
            case '3': this.emulator.runRate = 100; this.showRateChange(100); break;
            case '4': this.emulator.runRate = 1000; this.showRateChange(1000); break;
            case '5': this.emulator.runRate = 10000; this.showRateChange(10000); break;
            case '6': this.emulator.runRate = 50000; this.showRateChange(50000); break;
            case '7': this.emulator.runRate = 100000; this.showRateChange(100000); break;
            case '8': this.emulator.runRate = 150000; this.showRateChange(150000); break;
            case 'f': this.toggleSense(8); break;     // R/F = S4
            case 'l': this.toggleSense(2); break;     // Load/OpSys = S2
            case 'd': this.toggleSense(4); break;     // S3
            case 'o': this.toggleSense(1); break;     // S1
            case 'p': this.toggleSense(4); break;     // S3 alias
            case 'h':
            case '?':
            case 'H':
                this.helpMode = true;
                this.dirty = true;
                return;
            case 'm':
                // Toggle microcode display
                this.session.writeln('Microcode view toggled');
                break;
            case 'q':
                this.stop();
                this.session.writeln('Disconnecting...');
                this.session.close();
                break;
            case 'x':
                // Full system reset
                this.emulator.stop();
                this.emulator.reset();
                this.session.writeln(fg(Color.BRIGHT_YELLOW) + bold() + 'SYSTEM RESET — CPU halted, press r to restart' + ansiReset());
                this.dirty = true;
                break;
            case '\r':
                // Just re-render
                this.dirty = true;
                this.render();
                break;
        }
    }

    private start(): void {
        this.render();
        this.refreshInterval = setInterval(() => {
            if (this.dirty || this.regDirty) {
                this.render();
            }
        }, 100); // 10 Hz refresh
    }

    private stop(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    markDirty(): void {
        this.dirty = true;
    }

    private showRateChange(rate: number): void {
        const rateStr = rate >= 1000 ? `${rate/1000}k` : String(rate);
        this.session.writeln(
            fg(Color.BRIGHT_CYAN) + `Run rate: ${rateStr} instructions/tick` + ansiReset()
        );
        this.dirty = true;
    }


    private renderSenseSwitches(): string {
        const g = global as any;
        const ss = g.window?.__senseSwitch;
        if (ss === undefined) return '';
        const val: number = ss;
        const labels = ['S1','S2(OpSys)','S3','S4(R/F)'];
        let out = fg(Color.BRIGHT_WHITE) + bold() + '  SENSE: ' + ansiReset();
        for (let i = 0; i < 4; i++) {
            out += (val & (1<<i))
                ? fg(Color.BRIGHT_GREEN) + bold() + labels[i] + ansiReset() + ' '
                : dim() + fg(Color.BRIGHT_BLACK) + labels[i].toLowerCase() + ansiReset() + ' ';
        }
        return out;
    }

    private toggleSense(bit: number): void {
        const g = global as any;
        if (g.window?.__senseSwitch !== undefined) {
            g.window.__senseSwitch ^= bit;
            const val = g.window.__senseSwitch;
            const bits = ['S1','S2','S3','S4'];
            let status = '';
            for (let i = 0; i < 4; i++) {
                status += (val & (1<<i)) ? fg(Color.BRIGHT_GREEN) + bits[i] + ansiReset() + ' ' :
                                           fg(Color.BRIGHT_BLACK) + bits[i].toLowerCase() + ansiReset() + ' ';
            }
            this.session.writeln('Sense switches: ' + status);
            // If Load/OpSys (S2, bit value 2) was toggled ON, reset the CPU
            if (bit === 2 && (val & 2)) {
                this.emulator.reset();
                this.session.writeln(fg(Color.BRIGHT_YELLOW) + 'CPU Reset (Load)' + ansiReset());
            }
        }
        this.dirty = true;
    }

    private buildHelpText(): string {
        const lines = [
            '',
            bold() + fg(Color.BRIGHT_WHITE) + '═══ CENTURION CPU-6 EMULATOR ═══' + ansiReset(),
            '',
            fg(Color.BRIGHT_CYAN) + 'CONTROLS' + ansiReset(),
            '  s         Step one instruction',
            '  r         Run / Halt',
            '  1-8       Speed: 1=1  2=10  3=100  4=1k  5=10k  6=50k  7=100k  8=150k/tick',
            '  m         Toggle microcode view',
            '  h / ?     This help',
            '  q         Disconnect',
            '  x         Full system reset (CPU halts; press r to run)',
            '  Enter     Re-render screen',
            '',
            fg(Color.BRIGHT_CYAN) + 'SENSE SWITCHES  (current state shown as "SENSE:" on the panel)' + ansiReset(),
            '  o         S1           = 1   ← ON selects DIAGNOSTICS at boot',
            '  l         S2  OPSYS    = 2   ← set ON for OS boot',
            '  d         S3           = 4',
            '  f         S4  R/F      = 8   ← set ON for OS boot',
            '  p         S3 alias',
            '  Boot ROM first instruction (0xFC00 BS1) tests S1:',
            '  S1 ON -> jumps to diag ROM at 0x8000;  S1 OFF -> normal boot.',
            '',
            fg(Color.BRIGHT_YELLOW) + 'BOOT DEFAULT INTO THE OS (CENTOS)  —  sense = 10 (S1 off, S2+S4 on)' + ansiReset(),
            '  1. Mount CENTOS_12/13.IMG on DSK2 unit 1 via Disk Manager (port 2326).',
            '     The server auto-mounts CENTOS_13.IMG and sets sense=10 at startup.',
            '  2. Press r to run.',
            '  3. On Terminal 0 (port 2324): type H1 (no Enter needed).',
            '  4. Answer date (MMDDYY+Enter) then time (HHMMSS+Enter) → CRT0 READY.',
            '',
            fg(Color.BRIGHT_YELLOW) + 'BOOT DIAG  —  sense = 1 (S1 ON)' + ansiReset(),
            '  Boot ROM jumps to the diag ROM at 0x8000. Requires the diag ROMs to',
            '  be installed: in the browser UI (cen.html) check "Diag ROMs Installed",',
            '  set the Diag Select DIPs (D8/D4/D2/D1) and press the diag-run button.',
            '  The in-process server core keeps diag ROMs DISABLED so CENTOS boots,',
            '  so diag boot is available in the browser UI only.',
            '',
            fg(Color.BRIGHT_WHITE) + 'PORTS' + ansiReset(),
            '  telnet localhost 2323  — Control Panel (this screen)',
            '  telnet localhost 2324  — Terminal 0 (CRT 0)',
            '  telnet localhost 2325  — Terminal 1 (CRT 1)',
            '  telnet localhost 2326  — Disk Manager',
            '  ws://localhost:42646   — Browser UI',
            '',
            fg(Color.BRIGHT_GREEN) + 'Press any key to return...' + ansiReset(),
        ];
        return lines.join('\r\n') + '\r\n';
    }

    private showHelp(): void {
        this.helpMode = true;
    }

    render(): void {
        if (this.helpMode) {
            const out = clearScreen() + cursorHome() + cursorHide() +
                this.buildHelpText();
            this.session.write(out);
            return;
        }
        const cpu = this.cpu;
        let out = '';

        out += clearScreen() + cursorHome() + cursorHide();

        // ── Title bar ──
        out += fg(Color.BRIGHT_WHITE) + bg(Color.BLUE) + bold();
        out += '  CENTURION CPU-6  │  Front Panel Monitor  │  [S]tep [R]un [M]icro [Q]uit  ';
        out += ansiReset() + '\r\n';

        // ── Status line ──
        const running = (cpu.sysctl & 16) !== 0;
        const statusColor = running ? Color.BRIGHT_GREEN : Color.BRIGHT_RED;
        out += fg(statusColor) + bold();
        out += running ? '  ▶ RUNNING' : '  ■ HALTED';
        out += ansiReset();
        // Execution mode: Regular (≤10k) or Fast (>10k, uses hsstep batch)
        const emuRate = this.emulator.runRate;
        const mode = emuRate > 10000 ? 'F' : 'R';
        const modeColor = emuRate > 10000 ? Color.BRIGHT_YELLOW : Color.BRIGHT_CYAN;
        out += fg(modeColor) + `  [${mode}]` + ansiReset();
        out += fg(Color.BRIGHT_BLACK) + `  ${emuRate >= 1000 ? emuRate/1000+'k' : emuRate}/tick` + ansiReset();

        if (cpu.memfault) {
            out += '  ' + blink() + fg(Color.BRIGHT_RED) + 'PARITY FAULT' + ansiReset();
        }
        out += '\r\n\r\n';

        // ── Front Panel LEDs ──
        out += this.renderFrontPanel();
        out += '\r\n';

        // ── Condition Codes & PTA ──
        out += this.renderConditions();
        out += '\r\n';

        // ── Sense Switches ──
        out += this.renderSenseSwitches();
        out += '\r\n';

        // ── Registers ──
        out += this.renderRegisters();
        out += '\r\n';

        // ── Micro State (if visible) ──
        out += this.renderMicroState();
        out += '\r\n';

        // ── Instruction display ──
        out += this.renderInstruction();
        out += '\r\n';

        // ── Help bar ──
        out += cursorPos(this.session.rows, 1);
        out += reverse() + fg(Color.BRIGHT_BLACK);
        const rate = this.emulator.runRate;
        const rateStr = rate >= 1000 ? `${rate/1000}k` : String(rate);
        const isRunning = this.emulator.isRunning;
        out += ` S:Step  R:${isRunning?'Halt':'Run'}  Speed:${rateStr}/tick [1-8]  Q:Quit  `;
        out += ansiReset();

        this.session.write(out);
        this.dirty = false;
    }

    /** Exit help mode and return to normal display */
    private exitHelp(): void {
        this.helpMode = false;
        this.dirty = true;
    }

    private renderFrontPanel(): string {
        const cpu = this.cpu;
        let out = '';

        // Address display (simplified - shows current PC)
        const addr = cpu.memaddr || cpu.physaddr;
        const map = cpu.map;

        out += fg(Color.BRIGHT_WHITE) + bold() + '  ADDRESS: ' + ansiReset();
        out += fg(Color.BRIGHT_CYAN) + hex5(addr) + ansiReset();
        out += fg(Color.BRIGHT_BLACK) + '  MAP:' + hex1(map);
        out += fg(Color.BRIGHT_BLACK) + '  LVL:' + hex1(cpu.level) + ansiReset();
        out += '     ';

        // Bus control status
        const bc = cpu.busctl;
        const sc = cpu.sysctl;
        out += fg(Color.BRIGHT_WHITE) + 'BUS: ' + ansiReset();
        out += led((bc & 1) !== 0, Color.BRIGHT_GREEN, 'I');    // Internal
        out += led((bc & 128) !== 0, Color.BRIGHT_YELLOW, 'DMA');
        out += led((bc & 16) !== 0, Color.BRIGHT_CYAN, 'DA');
        out += led((bc & 4) === 0, Color.BRIGHT_MAGENTA, 'CE');
        out += led((bc & 8) !== 0, Color.BRIGHT_BLUE, 'U');
        out += led((bc & 8) === 0, Color.BRIGHT_BLUE, 'D');
        out += led((bc & 32) !== 0, Color.BRIGHT_RED, 'PO');
        out += led((bc & 64) !== 0, Color.RED, 'PFE');
        out += '  ';

        out += fg(Color.BRIGHT_WHITE) + 'SYS: ' + ansiReset();
        out += `DV${sc & 3} `;
        out += led((sc & 4) !== 0, Color.YELLOW, 'TE');
        out += led((sc & 16) !== 0, Color.BRIGHT_GREEN, 'R');
        out += led((sc & 16) === 0, Color.BRIGHT_RED, 'H');
        out += led((sc & 32) === 0, Color.CYAN, 'TR');
        out += led((sc & 64) !== 0, Color.BRIGHT_YELLOW, 'A');
        out += led((sc & 128) !== 0, Color.BRIGHT_RED, 'IA');

        return out;
    }

    private renderConditions(): string {
        const cpu = this.cpu;
        const cc = cpu.cc;
        let out = '';

        out += fg(Color.BRIGHT_WHITE) + bold() + '  CC: ' + ansiReset();
        out += led((cc & 8) !== 0, Color.BRIGHT_RED, 'V');     // Overflow
        out += led((cc & 4) !== 0, Color.BRIGHT_YELLOW, 'M');   // Minus
        out += led((cc & 2) !== 0, Color.BRIGHT_GREEN, 'F');    // Flag
        out += led((cc & 1) !== 0, Color.BRIGHT_CYAN, 'L');     // Link
        out += '   ';

        // ALU flags
        const af = cpu.alu_flag;
        out += fg(Color.BRIGHT_WHITE) + 'ALU: ' + ansiReset();
        out += led((af & 0x20) !== 0, Color.BRIGHT_RED, 'L');
        out += led((af & 0x10) !== 0, Color.BRIGHT_YELLOW, 'H');
        out += led((af & 0x08) !== 0, Color.BRIGHT_GREEN, 'C');
        out += led((af & 0x04) !== 0, Color.RED, 'V');
        out += led((af & 0x02) !== 0, Color.CYAN, 'S');
        out += led((af & 0x01) !== 0, Color.BLUE, 'Z');
        out += '   ';

        out += fg(Color.BRIGHT_WHITE) + 'PTA: ' + ansiReset() + hex1(cpu.map);

        return out;
    }

    private renderRegisters(): string {
        const cpu = this.cpu;
        let out = '';

        out += fg(Color.BRIGHT_WHITE) + bold() + '  REGISTERS' + ansiReset() + '\r\n';

        // Internal registers
        const regs = [
            ['RES ', cpu.result, 2],
            ['SWAP', cpu.swap, 2],
            ['RIR ', cpu.rir, 2],
            ['RDR ', cpu.rdr, 2],
            ['DIN ', cpu.memdata_in, 2],
            ['DOUT', cpu.memdata_out, 2],
            ['WADR', cpu.workaddr, 4],
            ['ALQ ', cpu.alu_q, 2],
        ];

        for (let i = 0; i < regs.length; i++) {
            const [name, value, width] = regs[i];
            const hexFn = width === 4 ? hex4 : hex2;
            out += fg(Color.BRIGHT_BLACK) + name + ': ' + ansiReset();
            out += fg(Color.BRIGHT_GREEN) + hexFn(value as number) + ansiReset();
            if (i % 4 === 3) out += '\r\n';
            else out += '  ';
        }
        out += '\r\n\r\n';

        // Register file (first 4 rows of 8)
        this.updateRegFileCache();
        out += fg(Color.BRIGHT_BLACK) + '  RF: ' + ansiReset();
        for (let i = 0; i < 4; i++) {
            out += '\r\n  ';
            for (let j = 0; j < 8; j++) {
                const idx = i * 8 + j;
                const val = this.lastRegFile[idx];
                out += fg(Color.BRIGHT_GREEN) + hex4(val) + ansiReset() + ' ';
            }
        }

        return out;
    }

    private updateRegFileCache(): void {
        const rf = this.cpu.regfile;
        if (!rf) return;
        let changed = false;
        for (let i = 0; i < 128; i++) {
            const idx = i * 2;
            const val = (rf[idx] << 8) | rf[idx + 1];
            if (val !== this.lastRegFile[i]) {
                this.lastRegFile[i] = val;
                changed = true;
            }
        }
        this.regDirty = !changed && this.regDirty;
    }

    private renderMicroState(): string {
        const cpu = this.cpu;
        const mstep = this.mstep;
        if (!mstep) return '';

        let out = '';
        out += fg(Color.BRIGHT_WHITE) + bold() + '  MICROCODE STATE' + ansiReset() + '\r\n';

        try {
            // Sequencer state
            out += '  SEQ: ' + fg(Color.BRIGHT_CYAN);
            out += `P:${hex1(cpu.s2_p)}${hex1(cpu.s1_p)}${hex1(cpu.s0_p)} `;
            out += `O:${hex1(cpu.s2_output)}${hex1(cpu.s1_output)}${hex1(cpu.s0_output)} `;
            out += `H:${hex1(cpu.s2_h)}${hex1(cpu.s1_h)}${hex1(cpu.s0_h)}`;
            out += ansiReset() + '\r\n';

            // ALU registers
            const aluReg = cpu.alu_reg;
            if (aluReg) {
                out += '  ALU: ';
                for (let i = 0; i < 16; i++) {
                    out += fg(Color.BRIGHT_GREEN) + hex2(aluReg[i]) + ansiReset() + ' ';
                }
                out += '\r\n';
            }

            // Sequencer stack
            out += '  STK: ';
            for (let i = 0; i < 4; i++) {
                const sp = (cpu.s2_sp - i) & 3;
                const sf = cpu.s2_sf;
                if (sf && sf.length > sp) {
                    out += fg(Color.BRIGHT_YELLOW) + hex1(sf[sp]) + ansiReset() + ' ';
                }
            }
            out += '\r\n';
        } catch {
            out += '  (microcode state unavailable)\r\n';
        }

        return out;
    }

    private renderInstruction(): string {
        const cpu = this.cpu;
        let out = '';

        out += fg(Color.BRIGHT_WHITE) + bold() + '  CURRENT INSTRUCTION' + ansiReset() + '\r\n';
        out += fg(Color.BRIGHT_CYAN);
        out += `  PC:${hex4(cpu.pc)}  PHYS:${hex5(cpu.physaddr)}  `;
        out += `OP:${hex2(cpu.micro_op0 & 0xFF)}:${hex2((cpu.micro_op0 >> 8) & 0xFF)}`;
        out += ansiReset();

        return out;
    }
}
