"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Identity_1 = require("./Identity");
var ReaderT_1 = require("./ReaderT");
var Pipeable_1 = require("./Pipeable");
exports.HKTId = 'Reader';
var T = ReaderT_1.getReaderM(Identity_1.Identity);
exports.ask = T.ask;
exports.asks = T.asks;
function local(f) {
    return function (ma) { return T.local(ma, f); };
}
exports.local = local;
;
function getSemigroup(s) {
    return {
        concat: function (x, y) { return function (e) { return s.concat(x(e), y(e)); }; }
    };
}
exports.getSemigroup = getSemigroup;
;
function getMonoid(m) {
    return {
        concat: getSemigroup(m).concat,
        empty: function () { return m.empty; }
    };
}
exports.getMonoid = getMonoid;
;
exports.Reader = {
    HKT: exports.HKTId,
    of: T.of,
    map: function (ma, f) { return function (e) { return f(ma(e)); }; },
    ap: T.ap,
    bind: T.bind
};
exports.ap = (_a = Pipeable_1.pipeable(exports.Reader), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=Reader.js.map