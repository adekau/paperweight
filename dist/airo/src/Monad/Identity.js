"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Function_1 = require("./Function");
var Pipeable_1 = require("./Pipeable");
;
exports.HKTId = 'Identity';
exports.Identity = {
    HKT: exports.HKTId,
    of: Function_1.identity,
    map: function (ma, f) { return f(ma); },
    bind: function (ma, f) { return f(ma); },
    ap: function (mab, ma) { return mab(ma); }
};
exports.ap = (_a = Pipeable_1.pipeable(exports.Identity), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=Identity.js.map