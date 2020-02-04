"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("./Func");
// f: T1 -> T1+T2
exports.inl = function () {
    return Func_1.func(function (x) { return ({
        kind: 'left',
        value: x
    }); });
};
// f: T2 -> T1+T2
exports.inr = function () {
    return Func_1.func(function (x) { return ({
        kind: 'right',
        value: x
    }); });
};
// [f+g]
exports.plus = function (f, g) { return function (x) { return x.kind === 'left'
    ? f(x.value)
    : g(x.value); }; };
// f+g: (f;inl)+(g;inr)
exports.plusMap = function (f, g) {
    return f
        .then(exports.inl())
        .plus(g
        .then(exports.inr()));
};
exports.swapSum = function () {
    return exports.inr()
        .plus(exports.inl());
};
//# sourceMappingURL=Sum.js.map