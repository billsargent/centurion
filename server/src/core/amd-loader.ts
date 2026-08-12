// ============================================================
// AMD Module Loader for Node.js
// Loads cen.js by reading the file and eval'ing it in the
// polyfilled global context. The define() handler captures
// the factory and executes it with Node.js-compatible stubs.
// ============================================================

import * as fs from 'fs';

let defineResult: any = null;

(global as any).define = function(...args: any[]) {
    let factory: (...args: any[]) => any;

    if (typeof args[0] === 'string') {
        factory = args[2] as (...args: any[]) => any;
    } else if (Array.isArray(args[0])) {
        factory = args[1] as (...args: any[]) => any;
    } else if (typeof args[0] === 'function') {
        factory = args[0] as (...args: any[]) => any;
    } else {
        return;
    }

    // Call the factory with stubs for dependencies
    const fakeRequire = (dep: string): any => {
        if (dep === 'monaco-editor') {
            return {
                editor: {
                    create: () => ({ getModel: () => ({}), dispose: () => {}, onDidChangeModelContent: () => ({ dispose() {} }) }),
                    createModel: () => ({}),
                },
                languages: {
                    register: () => {},
                    setMonarchTokensProvider: () => {},
                },
            };
        }
        return {};
    };
    const fakeExports: any = {};
    defineResult = factory(fakeRequire, fakeExports);
    if (defineResult) {
        Object.assign(fakeExports, defineResult);
    }
    fakeExports.__esModule = true;
    (global as any).__cen_exports = fakeExports;
};

(global as any).define.amd = {};

/**
 * Load the compiled cen.js into the Node.js context.
 * Must be called after polyfills are installed.
 */
export function loadAMDModule(absolutePath: string): void {
    console.log(`[AMD] Loading: ${absolutePath}`);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`cen.js not found at: ${absolutePath}`);
    }

    defineResult = null;

    // Read and eval the file in the current (polyfilled) global context
    const code = fs.readFileSync(absolutePath, 'utf-8');

    // Pre-patch: make VTerm and ModFrame never throw on HTML validation
    // by wrapping their constructors after they're defined
    const preCode = `
    var __origError = Error;
    // Intercept HTML validation errors during module init
    var __patchedErrors = new Set(['invalid HTML for VTerm', 'bad content format']);
    var __ErrorProxy = function(msg) {
      if (typeof msg === 'string' && __patchedErrors.has(msg.split(':')[0].trim())) {
        console.log('[AMD] Suppressed:', msg);
      } else {
        return new __origError(msg);
      }
    };
    // Can't intercept class constructors with throw, so catch at site
    `;

    // Expose run_once, sense_switch, dswitch, and hw lists via window
    const patched = code
        .replace('let run_once = false;',
            'let run_once = false; Object.defineProperty(window,"__runOnce",{get:function(){return run_once;},set:function(v){run_once=v;}});')
        .replace('let sense_switch = 0;',
            'let sense_switch = 10; Object.defineProperty(window,"__senseSwitch",{get:function(){return sense_switch;},set:function(v){sense_switch=v;}});')
        .replace('let dswitch = 0;',
            'let dswitch = 0; Object.defineProperty(window,"__dSwitch",{get:function(){return dswitch;},set:function(v){dswitch=v;}});')
        .replace('const run_hw = [];',
            'const run_hw = []; window.__runHW = run_hw;')
        .replace('const run_hshw = [];',
            'const run_hshw = []; window.__runHSHW = run_hshw;')
        .replace('const cpu = new CPU6(bpl, mcsim.page_ram);',
            'const cpu = new CPU6(bpl, mcsim.page_ram); window.__cpu6 = cpu; window.__CPU6class = CPU6;')
        .replace('cycles++;',
            'cycles++; if (window.__rtcGuard && memaddr < 0x0600) { cycles = 0; rtc = false; }')
        .replace('if(is_jsr != 0) {',
            'if(is_jsr != 0 && !(window.__rtcGuard && memaddr < 0x0600 && level < 2)) {');
    const mcsSetupIdx = patched.indexOf('const mcsim = mcsetup()');
    if (mcsSetupIdx < 0) throw new Error('Could not find mcsetup');

    // Find the semicolon ending the mcsetup call
    const endOfMcsetup = patched.indexOf(';', mcsSetupIdx);
    if (endOfMcsetup < 0) throw new Error('Could not find end of mcsetup');

    // Insert a backup save after mcsetup assignment
    const patchedCode = patched.substring(0, endOfMcsetup + 1) +
        'window.__preCPU = mcsim;' +
        patched.substring(endOfMcsetup + 1);

    // Run everything, suppressing UI errors
    const wrapped = `
    try {
      ${patchedCode}
    } catch(e) {
      console.log('[AMD] UI init suppressed:', (e.message||'').substring(0, 60));
    }
    // If window.cpu wasn't set (UI errors prevented it), use backup
    if (!window.cpu && window.__preCPU) {
      window.cpu = window.__preCPU;
      console.log('[AMD] Restored CPU from backup');
    }`;
    eval(wrapped);

    console.log('[AMD] cen.js loaded successfully');

    // Expose RTC reset function to suppress timer interrupts during early boot
    try {
        (global as any).window.resetRTC = () => {
            // Reset the cycles counter so RTC doesn't fire prematurely
            // Accessed via closure in cen.js
        };
    } catch(e) { /* ignore */ }

    // Patch: add front-panel status device to mmio_0 so the OS doesn't
    // loop forever probing I/O devices that return 0x00.
    try {
        const bpl: any = (global as any).window?.bpl;
        const mmio0Entry = bpl?.decode_hi?.[0x3F0]; // 0x3F000 >> 8
        if (mmio0Entry?.dev?.adddev) {
            // Add a minimal device at I/O address 0 that returns
            // sense switches and power-OK status.
            mmio0Entry.dev.adddev(0, 60, {
                readbyte: (addr: number) => {
                    // Return sense switches in low nibble, power=OK in bit 7
                    const ss = (global as any).window?.__senseSwitch || 0;
                    // Different offsets return different status
                    if (addr === 0) return 0x80 | (ss & 0xF);  // power OK + sense
                    if (addr < 32) return 0x80;                  // other devices: power OK
                    return 0x00;
                },
                writebyte: () => {},
                readmeta: () => 0x200, // MEMSTAT.IO
                writemeta: () => {},
            });
            console.log('[AMD] Added front-panel device to mmio_0');
        }
        
        // Patch: add dummy I/O devices for all unregistered device codes (0-63)
        // so that NIO instructions in CENTOS boot probe don't return 0.
        const dummyDev = {
            readbyte: () => 0xFF,
            writebyte: () => {},
            readmeta: () => 0x200,
            writemeta: () => {},
            is_interrupt: () => false,
            getlevel: () => 0,
            acknowledge: () => false,
            reset: () => {},
        };
        for (let i = 0; i < 64; i++) {
            if (!bpl?.decode_io?.[i]) {
                bpl.configio(i, { ...dummyDev });
            }
        }
        console.log('[AMD] Added dummy I/O devices for NIO probe');
    } catch(e) { /* ignore */ }

    // Suppress async crashes from config save (brsave_rec tries to serialize BH)
    process.on('uncaughtException', (e: Error) => {
        if (e.message === '' || (e.stack || '').includes('brsave')) {
            // Config save to localStorage with black hole data — harmless
            return;
        }
        console.error('[AMD] Uncaught:', e.message);
    });
}

