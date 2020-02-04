"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("../src/Func");
var Prod_1 = require("../src/Prod");
describe('Function Product', function () {
    it('prod', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var isEven = Func_1.func(function (x) { return !(x % 2); });
        var f = incr.times(isEven);
        expect(f.f(5)).toEqual({ fst: 6, snd: false });
    });
    it('fst, snd', function () {
        var addOne = Func_1.func(function (x) { return x + 1; });
        var addTwo = Func_1.func(function (x) { return x + 2; });
        var tuple = addOne.times(addTwo);
        expect(tuple.f(1)).toEqual({ fst: 2, snd: 3 });
        expect(tuple.then(Prod_1.fst()).f(1)).toBe(2);
        expect(tuple.then(Prod_1.snd()).f(1)).toBe(3);
    });
    it('func timesMap', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var decr = Func_1.func(function (x) { return x - 1; });
        var isEven = Func_1.func(function (x) { return !(x % 2); });
        var f = (incr.times(decr)).then(incr.timesMap(isEven));
        var f2 = (incr.timesMap(decr));
        expect(f.f(1)).toEqual({ fst: 3, snd: true });
        expect(f.f(2)).toEqual({ fst: 4, snd: false });
        expect(f2.f({ fst: 5, snd: 15 })).toEqual({ fst: 6, snd: 14 });
    });
    it('swap product', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var decr = Func_1.func(function (x) { return x - 1; });
        var prod = incr.timesMap(decr);
        var prodSwap = prod.then(Prod_1.swapProd());
        expect(Func_1.apply(prod, { fst: 14, snd: 26 })).toEqual({ fst: 15, snd: 25 });
        expect(Func_1.apply(prodSwap, { fst: 14, snd: 26 })).toEqual({ fst: 25, snd: 15 });
    });
});
//# sourceMappingURL=Prod.test.js.map