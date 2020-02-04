"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("./Func");
var Prod_1 = require("./Prod");
// absurd: Zero -> a
exports.absurd = function () {
    return Func_1.func(function (_) {
        throw new Error('Does not exist.');
    });
};
// unit: a -> One
exports.unit = function () {
    return Func_1.func(function (_) { return ({}); });
};
// identity: a -> a
exports.identity = function () {
    return Func_1.func(function (x) { return x; });
};
exports.constant = function (val) { return Func_1.func(function (_) { return val; }); };
exports.powerOfZero = function () {
    return exports.unit();
};
exports.powerOfZeroInv = function () {
    return Func_1.curry(exports.absurd()
        .after(Prod_1.snd()));
};
exports.prodIdentity = function () {
    return Prod_1.fst();
};
exports.prodIdentityInv = function () {
    return exports.identity()
        .times(exports.unit());
};
//# sourceMappingURL=Category.js.map