"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Pipeable_1 = require("./Pipeable");
// Identifier of the higher-kinded type to use for this monad.
exports.HKTId = 'Maybe';
exports.Nothing = { _tag: 'Nothing' };
exports.Just = function (value) { return ({ _tag: 'Just', value: value }); };
exports.isJust = function (m) { return m._tag === 'Just'; };
exports.isNothing = function (m) { return m._tag === 'Nothing'; };
exports.fold = function (onNothing, onJust) {
    return function (m) { return (exports.isNothing(m) ? onNothing() : onJust(m.value)); };
};
exports.getApplySemigroup = function (s) { return ({
    concat: function (x, y) { return (exports.isJust(x) && exports.isJust(y)) ? exports.Just(s.concat(x.value, y.value)) : exports.Nothing; }
}); };
exports.Maybe = {
    HKT: exports.HKTId,
    map: function (ma, f) {
        return (exports.isNothing(ma) ? exports.Nothing : exports.Just(f(ma.value)));
    },
    ap: function (fab, fa) {
        return exports.isNothing(fab) || exports.isNothing(fa) ? exports.Nothing : exports.Just(fab.value(fa.value));
    },
    of: function (a) { return exports.Just(a); },
    bind: function (fa, f) {
        return exports.isNothing(fa) ? exports.Nothing : f(fa.value);
    }
};
exports.ap = (_a = Pipeable_1.pipeable(exports.Maybe), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.flatten = _a.flatten, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=Maybe.js.map