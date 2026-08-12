// ============================================================
// Shared interfaces for Centurion CPU-6 Emulator
// Used by both browser UI and Node.js Telnet server
// ============================================================

// ---- Character I/O (Serial/Terminal) ----

export interface CharDevice {
    emu_linked?: boolean;
    /** Data into this device */
    receive(c: number): void;
    /** Can this device accept data? */
    can_receive(): boolean;
    /** TX budget check (called periodically) */
    check_send(): void;
    /** Get current remote/paired device */
    get_dev(): CharDevice | undefined;
    /** The line (dis)connected */
    bind_dev(dev: CharDevice | undefined): void;
    /** Our RTS line changed, their CTS */
    set_cts(value: boolean): void;
    /** Allow getting RTS state */
    rts: boolean;
    /** Device name for display */
    name?: string;
}

// ---- Memory Access ----

export enum MemStatus {
    IO      = 0x200,
    P_ODD   = 0x100,
    ACC_BRK = 0x1000,
    RD_BRK  = 0x2000,
    WT_BRK  = 0x4000,
    ALL_BRK = 0x7000,
    OPEN    = 0x8000,
}

export interface MemAccess {
    readbyte(address: number): number;
    readmeta(address: number): number;
    writemeta(address: number, value: number): void;
    writebyte(address: number, value: number): void;
}

// ---- I/O Device ----

export interface IOAccess {
    is_interrupt(): boolean;
    getlevel(): number;
    acknowledge(): boolean;
    reset(): void;
}

// ---- DMA Device ----

export interface DMAControl {
    read(): number;
    write(value: number): void;
    end(): void;
}

export interface DMADevice {
    dma_mask: number;
    dma_request: boolean;
    dma_step(ctrl: DMAControl): void;
    dma_select(enable: boolean, dev: number): void;
}

// ---- Disk Images ----

export type DiskType = 'empty' | 'hawk' | 'finch';

export interface DiskImage {
    type: DiskType;
    filename: string;
    identifier?: string;
    stride: number;
    backing_data: ArrayBuffer;
    protect: boolean;
    data: Uint8Array;
}

export interface DiskContainer {
    set_disk(image: DiskImage | null): void;
}

export interface DiskTemplate {
    kind: 'hawk' | 'finch';
    stride: number;
    size: number;
}

export const FINCH_TRACK = 13440;
export const FINCH_TPP = 605;
export const FINCH_PLAT = FINCH_TRACK * FINCH_TPP;

// ---- Periodic Runnables ----

export interface Run {
    run(increment: number): void;
}

// ---- CPU Interface ----

export interface ICCPU {
    can_step: boolean;
    step(dbg: boolean): void;
    showstate(in_halt: boolean): void;
    reset(): void;

    // State accessors (for display)
    readonly level: number;
    readonly map: number;
    readonly pc: number;
    readonly physaddr: number;
    readonly at_boundry: boolean;
    readonly cc: number;
    readonly parity: number;
    readonly memfault: number;
    readonly memaddr: number;

    // Register file (256 bytes)
    readonly regfile: Uint8Array;
    // Page table (256 bytes)
    readonly pagetb: Uint8Array;

    // Internal state for display
    readonly workaddr: number;
    readonly result: number;
    readonly rir: number;
    readonly rdr: number;
    readonly swap: number;
    readonly alu_flag: number;
    readonly busctl: number;
    readonly sysctl: number;
    readonly pgram: number;
    readonly memdata_in: number;
    readonly memdata_out: number;
    readonly seq_out: number;
    readonly datapath: number;
    readonly dma_status: number;
    readonly micro_op0: number;
    readonly micro_op1: number;
    readonly seq_p: number;
    readonly seq_h: number;
    readonly seq_sp: number;
    readonly seq_sf: number[];
    readonly alu_q: number;
    readonly alu_r: Uint8Array;

    // Sequencer registers (for microcode display)
    readonly s0_output: number;
    readonly s1_output: number;
    readonly s2_output: number;
    readonly s0_p: number;
    readonly s1_p: number;
    readonly s2_p: number;
    readonly s0_h: number;
    readonly s1_h: number;
    readonly s2_h: number;
    readonly s0_sp: number;
    readonly s1_sp: number;
    readonly s2_sp: number;
    readonly s0_sf: number[];
    readonly s1_sf: number[];
    readonly s2_sf: number[];
    readonly alu_reg: Uint8Array;
    readonly alu_regq: number;

    // Breakpoints
    add_virtual_break(address: number, f: BreakFunction | null | number): number;
    remove_break(f: BreakFunction | null | number): void;
    remove_break_at(address: number): void;
    change_virtual_break(old_f: BreakFunction | null | number, new_f: BreakFunction): void;

    // DMA
    dma_register(device: DMADevice): void;
    dma_int(dev: DMADevice, en: boolean): void;
    dma_request(): void;

    set_pc(va: number): void;
}

export type BreakFunction = (kind: number, address: number, physical: number) => boolean;

// ---- Microcode execution ----

export interface MicroStepCPU {
    hsstep(): void;
    hspre(): void;
    hsend(): void;
}

// ---- Console message handler ----

export interface ConsoleHandler {
    log(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}

// ---- Server configuration ----

export interface ServerConfig {
    telnet: {
        controlPanel: number;   // port for register/LED display
        terminal0: number;      // port for CRT 0
        terminal1: number;      // port for CRT 1
        diskManager: number;    // port for disk management
    };
    websocket: {
        port: number;           // port for browser WebSocket connection
    };
    emulation: {
        runRate: number;        // instructions per tick
        autoStart: boolean;     // start running immediately
    };
}

export const DEFAULT_CONFIG: ServerConfig = {
    telnet: {
        controlPanel: 2323,
        terminal0: 2324,
        terminal1: 2325,
        diskManager: 2326,
    },
    websocket: {
        port: 42646,
    },
    emulation: {
        runRate: 10000,
        autoStart: false,
    },
};

// ---- Utility types ----

export interface DisplayState {
    registers: string;      // Formatted register dump
    frontPanel: string;     // Front panel LED state
    pageTable: string;      // Page table display
    microState: string;     // Microcode state
    status: string;         // Run/halt status
    aluState: string;       // ALU register state
}

export interface DiskInfo {
    name: string;
    type: DiskType;
    size: number;
    stride: number;
    protected: boolean;
    unitIndex: number;
    controllerType: 'dsk2' | 'finch';
    mounted: boolean;
}

// ---- WebSocket Protocol (mirrors existing binary protocol) ----

export enum WSMessageType {
    HELLO       = 0x0020,
    GET_EXT     = 0x0040,
    EXT_RESP    = 0x0048,
    STEP_SYNC   = 0x0009,
    GET_STATE   = 0x000A,
    HALF_STEP   = 0x000B,
    STEP_N      = 0x000D,
    STATE_UPDATE = 0x04A0,
    STATE_AFTER  = 0x04B0,
    SER_ENUM    = 0x1800,
    SER_ENUM_R  = 0x1808,
    SER_DATA    = 0x1820,
    SER_CTRL    = 0x1830,
    FSYS_ENUM   = 0x2000,
}
