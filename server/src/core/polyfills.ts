// ============================================================
// Node.js DOM Polyfills for Centurion Emulator Core
// "Black hole" approach: every stub absorbs any property
// access or method call without throwing.
// ============================================================

function createBlackHole(): any {
    return new Proxy(function() { return createBlackHole(); }, {
        get(_t: any, p: any) {
            // Common DOM checks that need specific return values
            if (p === 'tagName') return {
                toUpperCase: () => 'DIV',
                toString: () => 'CANVAS',
                [Symbol.toPrimitive]: () => 'CANVAS',
            };
            if (p === 'toString') return () => '';
            if (p === 'valueOf') return () => 0;
            if (p === Symbol.toPrimitive) return (hint: string) => hint === 'number' ? 2 : '';
            if (p === Symbol.iterator) return function*() {};
            return createBlackHole();
        },
        set(_t: any, _p: any, _v: any) { return true; },
        apply(_t: any, _this: any, _args: any[]) { return createBlackHole(); },
        construct(_t: any, _args: any[]) { return createBlackHole(); },
    });
}

function mockAtob(d: string): string { return Buffer.from(d, "base64").toString("binary"); }
function mockBtoa(d: string): string { return Buffer.from(d, "binary").toString("base64"); }

export function installPolyfills(): void {
    const g = global as any;
    const bh = createBlackHole();

    function safeSet(obj: any, key: string, value: any): void {
        try { obj[key] = value; } catch { }
    }

    const listeners = new Map<string, Set<Function>>();
    g.addEventListener = (ev: string, h: Function) => { if (!listeners.has(ev)) listeners.set(ev, new Set()); listeners.get(ev)!.add(h); };
    g.removeEventListener = (ev: string, h: Function) => { listeners.get(ev)?.delete(h); };
    g.dispatchEvent = () => true;
    g.scrollX = 0; g.scrollY = 0; g.innerWidth = 1920; g.innerHeight = 1080;
    safeSet(g, "atob", mockAtob);
    safeSet(g, "btoa", mockBtoa);
    safeSet(g, "setTimeout", setTimeout);
    safeSet(g, "clearTimeout", clearTimeout);
    safeSet(g, "setInterval", setInterval);
    safeSet(g, "clearInterval", clearInterval);
    safeSet(g, "requestAnimationFrame", () => 0);
    safeSet(g, "cancelAnimationFrame", () => {});
    safeSet(g, "console", console);
    safeSet(g, "performance", { now: () => Date.now() });
    safeSet(g, "navigator", { userAgent: "Node.js" });
    safeSet(g, "location", { href: "file:///", protocol: "file:" });
    safeSet(g, "screen", { width: 1920, height: 1080 });
    safeSet(g, "Uint8ClampedArray", Uint8Array);
    safeSet(g, "SharedArrayBuffer", ArrayBuffer);
    safeSet(g, "fetch", () => new Promise(() => {}));

    safeSet(g, "window", g);
    safeSet(g, "self", g);
    safeSet(g, "localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, get length() { return 0; }, key: () => null });
    safeSet(g, "sessionStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, get length() { return 0; }, key: () => null });

    // ------------------------------------------------------------------
    // Document stub. Certain checkboxes must read as a real boolean `false`
    // (the black-hole proxy returns a truthy Proxy, which silently flips
    // feature flags — the root cause of the "diagins" memory bug and the
    // "BiquadFilterNode is not defined" audio spam):
    //  - 'diagins' (diag ROMs) — if CHECKED, setupmemory() wipes RAM at
    //    0x8000-0xBFFF and replaces it with ROMs → OS boot breaks.
    //  - 'ck_sound' (sound) — if truthy, the VT100 BEL handler calls
    //    wa_setup() → `new BiquadFilterNode(...)` throws repeatedly.
    // ------------------------------------------------------------------
    const checkboxOff = {
        checked: false,
        value: '',
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
    };
    const docStub = new Proxy(function() {}, {
        get(_t: any, p: string | symbol) {
            if (p === 'getElementById') {
                return (id: string) => {
                    // Checkboxes whose `.checked` must read as a real `false`
                    if (id === 'diagins' || id === 'ck_sound') return checkboxOff;
                    return bh;
                };
            }
            if (p === 'createElement') return () => bh;
            if (p === 'createElementNS') return () => bh;
            if (p === 'querySelector') return () => null;
            if (p === 'querySelectorAll') return () => [];
            if (p === 'addEventListener') return () => {};
            if (p === 'removeEventListener') return () => {};
            if (p === 'documentElement') return { style: {} };
            if (p === 'body') return { style: {} };
            if (p === 'head') return { style: {} };
            return bh;
        },
        set() { return true; },
        apply() { return docStub; },
    });
    safeSet(g, "document", docStub);

    // Web Audio node classes — cen.js's wa_setup() instantiates these with
    // `new BiquadFilterNode(...)` / `new GainNode(...)` / `new OscillatorNode(...)`.
    // Even with sound off, add them so any audio path never throws.
    for (const k of ["WebSocket",
        "AudioContext","webkitAudioContext","BiquadFilterNode","GainNode",
        "OscillatorNode","AudioParam","AudioBuffer","AudioBufferSourceNode",
        "AnalyserNode","WaveShaperNode","DelayNode","ConvolverNode","PannerNode",
        "ScriptProcessorNode","IIRFilterNode","ConstantSourceNode",
        "StereoPannerNode","MediaStreamAudioSourceNode",
        "URL","Blob","FileReader","ImageData",
        "OffscreenCanvas","HTMLCanvasElement","HTMLElement","HTMLDivElement",
        "HTMLSpanElement","HTMLButtonElement","HTMLInputElement","HTMLSelectElement",
        "HTMLOptionElement","HTMLLabelElement","HTMLTextAreaElement","HTMLTableElement",
        "CanvasRenderingContext2D","OffscreenCanvasRenderingContext2D",
        "WebGLRenderingContext","MutationObserver","ResizeObserver","Event",
        "MouseEvent","KeyboardEvent","DOMParser","XMLHttpRequest","Worker",
        "CustomEvent","createImageBitmap"]) {
        safeSet(g, k, bh);
    }

    console.log("[Polyfills] All stubs installed (black hole mode)");
}

export function getElementStub(_id: string): any { return createBlackHole(); }
