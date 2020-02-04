"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pipe(v) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    if (!fns.length)
        throw Error('Unexpected number of arguments passed to `pipe`.');
    return fns.reduce(function (acc, curFn) { return curFn(acc); }, v);
}
exports.pipe = pipe;
var isFunctor = function (x) {
    return Object.prototype.hasOwnProperty.call(x, 'map')
        && typeof x.map === 'function';
};
var isApply = function (x) {
    return Object.prototype.hasOwnProperty.call(x, 'ap')
        && typeof x.ap === 'function';
};
var isBindable = function (x) {
    return Object.prototype.hasOwnProperty.call(x, 'bind')
        && typeof x.bind === 'function';
};
var isApplicative = function (x) {
    return Object.prototype.hasOwnProperty.call(x, 'of')
        && typeof x.of === 'function';
};
function pipeable(I) {
    var r = {};
    if (isFunctor(I)) {
        var map = function (f) { return function (fa) {
            return I.map(fa, f);
        }; };
        r.map = map;
    }
    if (isApply(I)) {
        var ap = function (fa) { return function (fab) {
            return I.ap(fab, fa);
        }; };
        var apFirst = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function (a) { return function () { return a; }; }), fb);
        }; };
        var apSecond = function (fb) { return function (fa) {
            return I.ap(I.map(fa, function () { return function (b) { return b; }; }), fb);
        }; };
        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = apSecond;
    }
    if (isBindable(I)) {
        var bind = function (f) { return function (fa) {
            return I.bind(fa, f);
        }; };
        var bindFirst = function (f) { return function (fa) {
            return I.bind(fa, function (a) { return I.map(f(a), function () { return a; }); });
        }; };
        var flatten = function (mma) {
            return I.bind(mma, function (a) { return a; });
        };
        r.bind = bind;
        r.bindFirst = bindFirst;
        r.flatten = flatten;
    }
    if (isApplicative(I)) {
        var of = function () { return function (a) {
            return I.of(a);
        }; };
        r.of = of;
    }
    return r;
}
exports.pipeable = pipeable;
//# sourceMappingURL=Pipeable.js.map