"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getReaderM(m) {
    return {
        map: function (ma, f) { return function (r) { return m.map(ma(r), f); }; },
        of: function (a) { return function () { return m.of(a); }; },
        ap: function (mab, ma) { return function (r) { return m.ap(mab(r), ma(r)); }; },
        bind: function (ma, f) { return function (r) { return m.bind(ma(r), function (a) { return f(a)(r); }); }; },
        ask: function () { return m.of; },
        asks: function (f) { return function (r) { return m.map(m.of(r), f); }; },
        local: function (ma, f) { return function (q) { return ma(f(q)); }; },
        fromReader: function (ma) { return function (r) { return m.of(ma(r)); }; },
        fromM: function (ma) { return function () { return ma; }; }
    };
}
exports.getReaderM = getReaderM;
;
//# sourceMappingURL=ReaderT.js.map