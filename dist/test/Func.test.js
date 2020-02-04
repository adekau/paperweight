"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var Category_1 = require("../src/Category");
var Func_1 = require("../src/Func");
describe('Func wrapper', function () {
    it('Increment function', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        expect(incr.f(5)).toBe(6);
    });
    it('Is Even', function () {
        var isEven = Func_1.func(function (x) { return !(x % 2); });
        expect(isEven.f(10)).toBe(true);
        expect(isEven.f(11)).toBe(false);
    });
    it('Negation', function () {
        var not = Func_1.func(function (x) { return !x; });
        expect(not.f(true)).toBe(false);
        expect(not.f(false)).toBe(true);
    });
    it('Composition', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var double = Func_1.func(function (x) { return x * 2; });
        var incrDouble = incr.then(double);
        expect(incrDouble.f(5)).toBe(12);
    });
    it('Composition the other way', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var double = Func_1.func(function (x) { return x * 2; });
        var doubleAfterIncr = double.after(incr);
        expect(doubleAfterIncr.f(5)).toBe(12);
    });
    it('Different range type', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var double = Func_1.func(function (x) { return x * 2; });
        var isEven = Func_1.func(function (x) { return !(x % 2); });
        var isIncrDoubleEven = incr.then(double).then(isEven);
        expect(isIncrDoubleEven.f(5)).toBe(true);
    });
    // test just shows that typescript does a pretty good job inferring types
    it('Infer', function () {
        var something = Func_1.func(function (x) { return "Your number is " + x; });
        var something2 = something.then(Func_1.func(function (x) { return x.length; }));
        expect(something2.f(5)).toBe(16);
    });
    it('distributes sum prod', function () {
        var sum = src_1.inr();
        var fn = Category_1.identity()
            .times(sum);
        var dist = fn.then(Func_1.distSumProd());
        expect(Func_1.apply(fn, 5)).toEqual({ fst: 5, snd: { kind: 'right', value: 5 } });
        expect(Func_1.apply(dist, 5)).toEqual({ kind: 'right', value: { fst: 5, snd: 5 } });
    });
    it('factors prod', function () {
        var sum = src_1.inr();
        var fn = Category_1.identity()
            .times(sum);
        var dist = fn.then(Func_1.distSumProd());
        var factor = dist.then(Func_1.factorSumProd());
        expect(Func_1.apply(factor, 5)).toEqual(Func_1.apply(fn, 5));
    });
});
//# sourceMappingURL=Func.test.js.map