"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Pipeable_1 = require("./Pipeable");
exports.HKTId = 'Either';
exports.inl = function (left) { return ({ _tag: 'Left', left: left }); };
exports.inr = function (right) { return ({ _tag: 'Right', right: right }); };
exports.isLeft = function (ma) { return ma._tag === 'Left'; };
exports.isRight = function (ma) { return ma._tag === 'Right'; };
exports.fold = function (onLeft, onRight) {
    return function (ma) { return exports.isLeft(ma) ? onLeft(ma.left) : onRight(ma.right); };
};
exports.getApplySemigroup = function (s) { return ({
    concat: function (x, y) { return exports.isLeft(x) ? x : exports.isLeft(y) ? y : exports.inr(s.concat(x.right, y.right)); }
}); };
exports.Either = {
    HKT: exports.HKTId,
    map: function (fa, f) {
        return exports.isLeft(fa) ? fa : exports.inr(f(fa.right));
    },
    ap: function (fab, fa) {
        if (exports.isLeft(fab))
            return fab;
        if (exports.isLeft(fa))
            return fa;
        return exports.inr(fab.right(fa.right));
    },
    of: function (a) { return exports.inr(a); },
    bind: function (fa, f) { return (exports.isLeft(fa)) ? fa : f(fa.right); }
};
exports.ap = (_a = Pipeable_1.pipeable(exports.Either), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.flatten = _a.flatten, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=Either.js.map