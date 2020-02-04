"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("./Func");
// <f*g> : TDomain -> T1*T2
exports.times = function (f, g) {
    return function (constructorInput) { return ({
        fst: f(constructorInput),
        snd: g(constructorInput)
    }); };
};
// fst: T1*T2 -> T1
exports.fst = function () { return Func_1.func(function (p) { return p.fst; }); };
// snd: T1*T2 -> T2
exports.snd = function () { return Func_1.func(function (p) { return p.snd; }); };
// <f*g> = <(fst;f)*(snd;g)>
exports.timesMap = function (f, g) {
    return (exports.fst()
        .then(f)).times(exports.snd()
        .then(g));
};
exports.swapProd = function () {
    return exports.snd()
        .times(exports.fst());
};
//# sourceMappingURL=Prod.js.map