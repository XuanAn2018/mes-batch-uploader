/* Test tong hop: FA 1 may + bao cao + lich su (chay that code trong index.html) */
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptStart = html.indexOf('<script>', html.indexOf('</style>'));
const scriptEnd = html.lastIndexOf('</script>');
const js = html.substring(scriptStart + 8, scriptEnd);

function makeEl(tag = 'div') {
    return {
        tagName: tag, style: {}, dataset: {}, children: [],
        value: '', checked: false, textContent: '', innerHTML: '', disabled: false,
        scrollTop: 0, scrollHeight: 0,
        classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
        appendChild(c) { this.children.push(c); return c; },
        addEventListener() {}, closest() { return makeEl(); },
        querySelector() { return null; }, querySelectorAll() { return []; },
        setAttribute() {}, getAttribute() { return null; }, focus() {}, click() {}, remove() {}
    };
}
const reg = new Map();
const getEl = (id) => { if (!reg.has(id)) reg.set(id, makeEl()); return reg.get(id); };
const documentStub = {
    getElementById: getEl, querySelector: () => null, querySelectorAll: () => [],
    createElement: (t) => makeEl(t), addEventListener() {}, body: makeEl('body')
};

const calls = { scan: [] };
const PACKAGES = [
    { packageId: 'PKG_A', lineName: 'LINE 10', styleText: 'YET0033RGL001004', target: '320', status: 'CF' },
    { packageId: 'PKG_B', lineName: 'LINE 11', styleText: 'YET0033RGL001005', target: '90', status: 'CF' }
];
const OPS = { PKG_A: 4, PKG_B: 2 };  // so operation gom ca opserial 1

const fetchStub = async (url) => {
    const json = (o) => ({ ok: true, status: 200, json: async () => o, text: async () => JSON.stringify(o) });
    if (url.includes('/packages')) return json({ data: { packages: PACKAGES } });
    if (url.includes('/iot-status')) {
        return json({ success: true, data: Array.from({ length: 10 }, (_, i) => ({
            MachineId: 'M' + (1000 + i), CurrOutput: 50, MotoTime: 3600, MXPACKAGE: '', Factory: 'P2C1' })) });
    }
    if (url.includes('/opdetails')) {
        const pkg = decodeURIComponent(url.match(/mxpackage=([^&]+)/)[1]);
        const n = OPS[pkg] || 2;
        return json({ success: true, data: { operations: Array.from({ length: n }, (_, i) => ({ opserial: String(i + 1) })) } });
    }
    if (url.includes('/scan')) { calls.scan.push(url); return json({ IsSuccess: true }); }
    return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
};

const ctx = {
    console, setTimeout: (fn) => { setImmediate(fn); return 0; }, clearTimeout() {},
    AbortController, URL, URLSearchParams, Math, Date, JSON, Promise, Set, Map, Array, Object,
    String, Number, Boolean, isNaN, parseInt, parseFloat, Error, isFinite,
    fetch: fetchStub, alert: (m) => console.log('[alert] ' + m), confirm: () => true,
    navigator: { clipboard: { writeText: async () => {} } },
    localStorage: { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } },
    document: documentStub, window: {}, location: { search: '', hostname: '', protocol: 'file:' }
};
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(js, ctx);
const S = (expr) => vm.runInContext(expr, ctx);

let failed = 0;
const assert = (c, m) => { if (c) console.log('PASS: ' + m); else { console.log('FAIL: ' + m); failed++; } };

getEl('asFactory').value = 'P2C1';
getEl('asDate').value = '2026-09-15';
getEl('asSkipLowTarget').checked = true;
getEl('asRoundRobin').checked = true;
getEl('asSkipDone').checked = true;
getEl('asFaMax').value = '1';
getEl('asFaPercent').value = '60';

(async () => {
    await S('loadAutoScanPackages()');   // mo file:// -> isLocalhost true, khong token -> API van duoc goi (test gia lap)
    await S('startAutoScanPipeline()');

    const faUrls = calls.scan.filter(u => u.includes('processtype=FA'));
    assert(calls.scan.length === 4, 'Gui dung 4 request (PKG_A 3 OP + PKG_B 1 OP, nhan ' + calls.scan.length + ')');
    assert(faUrls.length === 1, 'Chi DUNG 1 may FA cho ca phien (nhan ' + faUrls.length + ')');
    assert(!calls.scan.some(u => u.includes('PKG_B') && u.includes('processtype=FA')), 'PKG_B khong co FA');
    assert(!calls.scan.some(u => /mxpackage=PKG_A&opserial=1/.test(u)), 'Khong bao gio dung opserial 1');

    /* Bao cao */
    const rep = JSON.parse(JSON.stringify(S('lastAutoScanReport')));
    assert(rep.rows.PKG_A && rep.rows.PKG_A.ok === 3 && rep.rows.PKG_A.planned === 3, 'Bao cao PKG_A (LINE 10): 3/3 OK');
    assert(rep.rows.PKG_A.target === 320, 'Bao cao PKG_A ghi Target 320');
    assert(rep.skipped.some(s => s.pkgId === 'PKG_B' && /Target < 100/.test(s.reason)), 'Bao cao ghi bo qua PKG_B (Target < 100)');
    assert(rep.factory === 'P2C1' && rep.dateVal === '2026-09-15', 'Bao cao ghi Factory/Date');

    /* Lich su chong chay lai */
    assert(S('autoScanDoneCount("PKG_A")') === 3, 'Lich su: PKG_A done 3 OP');
    assert(S('isAutoScanPkgDone("PKG_A")') === true, 'Lich su: PKG_A da chay xong');

    /* Chay lai lan 2: PKG_A bi bo qua, khong gui request nao cho PKG_A */
    calls.scan.length = 0;
    ctx.asStatSuccessVal = 0;
    S('autoScanSelectedIds.add("PKG_A"); autoScanSelectedIds.add("PKG_B");');
    S('asSkipLowTargetCheckedBackup = 0');
    await S('startAutoScanPipeline()');
    assert(calls.scan.filter(u => u.includes('PKG_A')).length === 0, 'Lan 2: khong scan lai PKG_A da xong (nhan ' + calls.scan.filter(u => u.includes('PKG_A')).length + ')');

    console.log(failed === 0 ? '\nALL TESTS PASSED' : '\n' + failed + ' TEST(S) FAILED');
    process.exit(failed === 0 ? 0 : 1);
})().catch(e => { console.error('LOI:', e); process.exit(1); });