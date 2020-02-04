"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("../src/Func");
var Sum_1 = require("../src/Sum");
describe('Function Sum', function () {
    it('sum', function () {
        var isEven = Func_1.func(function (x) { return !(x % 2); });
        var not = Func_1.func(function (x) { return !x; });
        var f = not.plus(isEven);
        expect(f.f({ kind: 'left', value: false })).toBe(true);
        expect(f.f({ kind: 'right', value: 11 })).toBe(false);
    });
    it('mapped sum', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var not = Func_1.func(function (x) { return !x; });
        var f = incr.plusMap(not);
        expect(f.f({ kind: 'left', value: 5 })).toEqual({ kind: 'left', value: 6 });
        expect(f.f({ kind: 'right', value: true })).toEqual({ kind: 'right', value: false });
    });
    it('swap sum', function () {
        var incr = Func_1.func(function (x) { return x + 1; });
        var not = Func_1.func(function (x) { return !x; });
        var sum = incr.plusMap(not);
        var sumSwap = sum.then(Sum_1.swapSum());
        expect(Func_1.apply(sum, { kind: 'left', value: 5 })).toEqual({ kind: 'left', value: 6 });
        expect(Func_1.apply(sum, { kind: 'right', value: true })).toEqual({ kind: 'right', value: false });
        expect(Func_1.apply(sumSwap, { kind: 'left', value: 5 })).toEqual({ kind: 'right', value: 6 });
        expect(Func_1.apply(sumSwap, { kind: 'right', value: true })).toEqual({ kind: 'left', value: false });
    });
});
//# sourceMappingURL=Sum.test.js.map