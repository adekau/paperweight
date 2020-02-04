"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Pipeable_1 = require("./Pipeable");
;
exports.HKTId = 'IO';
exports.IO = {
    HKT: exports.HKTId,
    map: function (fa, f) { return function () { return f(fa()); }; },
    of: function (a) { return function () { return a; }; },
    ap: function (fab, fa) { return function () { return fab()(fa()); }; },
    bind: function (fa, f) { return f(fa()); }
};
exports.ap = (_a = Pipeable_1.pipeable(exports.IO), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.flatten = _a.flatten, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=IO.js.map