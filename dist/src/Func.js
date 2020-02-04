"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prod_1 = require("./Prod");
var Sum_1 = require("./Sum");
var Category_1 = require("./Category");
exports.func = function (f) { return ({
    f: f,
    after: function (g) {
        var _this = this;
        return exports.func(function (x) { return _this.f(g.f(x)); });
    },
    then: function (g) {
        var _this = this;
        return exports.func(function (x) { return g.f(_this.f(x)); });
    },
    times: function (g) {
        return exports.func(Prod_1.times(this.f, g.f));
    },
    timesMap: function (g) {
        return Prod_1.timesMap(this, g);
    },
    plus: function (g) {
        return exports.func(Sum_1.plus(this.f, g.f));
    },
    plusMap: function (g) {
        return Sum_1.plusMap(this, g);
    }
}); };
// f: T1*T2 -> TRange
// curry(f): T1 -> (T2 -> TRange)
exports.curry = function (f) {
    return exports.func(function (a) { return exports.func(function (b) { return f.f({
        fst: a,
        snd: b
    }); }); });
};
// apply: (TDomain -> TRange) * TDomain -> TRange
exports.apply = function (f, x) { return f.f(x); };
// applyPair: (TDomain -> TRange) * TDomain -> TRange
exports.applyPair = function () {
    return exports.func(function (p) { return p.fst.f(p.snd); });
};
exports.distSumProd = function () {
    var f1 = Prod_1.swapProd().then(Sum_1.inl()), f = exports.curry(f1), g1 = Prod_1.swapProd().then(Sum_1.inr()), g = exports.curry(g1);
    return Category_1.identity()
        .timesMap(f.plus(g))
        .then(Prod_1.swapProd())
        .then(exports.applyPair());
};
exports.factorSumProd = function () {
    var f = Prod_1.fst()
        .plus(Prod_1.fst());
    var g = Prod_1.snd()
        .then(Sum_1.inl())
        .plus(Prod_1.snd()
        .then(Sum_1.inr()));
    return f.times(g);
};
//# sourceMappingURL=Func.js.map