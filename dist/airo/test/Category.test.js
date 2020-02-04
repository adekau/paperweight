"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category_1 = require("../src/Category");
var Func_1 = require("../src/Func");
describe('Category', function () {
    it('Absurd should not be callable', function () {
        expect(function () { return Func_1.apply(Category_1.absurd(), 5); }).toThrowError('Does not exist.');
    });
    it('power of zero', function () {
        var pz = Func_1.apply(Category_1.powerOfZero(), Func_1.func(function () { return 5; }));
        expect(pz).toEqual({});
    });
    it('power of zero inverse', function () {
        var pzi = Func_1.apply(Category_1.powerOfZeroInv(), {});
        expect(function () { return Func_1.apply(pzi, 1); }).toThrowError('Does not exist.');
    });
    it('prod identity', function () {
        expect(Func_1.apply(Category_1.prodIdentity(), { fst: 5, snd: {} })).toBe(5);
    });
    it('prod identity inverse', function () {
        expect(Func_1.apply(Category_1.prodIdentityInv(), 5)).toEqual({ fst: 5, snd: {} });
    });
});
//# sourceMappingURL=Category.test.js.map