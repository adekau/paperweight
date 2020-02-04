"use strict";
exports.__esModule = true;
var Monoid_1 = require("../../src/Monad/Monoid");
describe('Monoid', function () {
    describe('Fold', function () {
        it('All', function () {
            var all = Monoid_1.fold(Monoid_1.monoidAll);
            expect(all([true, true, true, true])).toBe(true);
            expect(all([false, true, true, true])).toBe(false);
            expect(all([true, false, true, true])).toBe(false);
            expect(all([true, true, false, true])).toBe(false);
            expect(all([true, true, true, false])).toBe(false);
            expect(all([true])).toBe(true);
            expect(all([])).toBe(true);
        });
        it('Any', function () {
            var any = Monoid_1.fold(Monoid_1.monoidAny);
            expect(any([true, true, true, true])).toBe(true);
            expect(any([false, true, true, true])).toBe(true);
            expect(any([true, false, true, true])).toBe(true);
            expect(any([true, true, false, true])).toBe(true);
            expect(any([true, true, true, false])).toBe(true);
            expect(any([true])).toBe(true);
            expect(any([false])).toBe(false);
            expect(any([false, false])).toBe(false);
            expect(any([])).toBe(false);
        });
        it('Sum', function () {
            var sum = Monoid_1.fold(Monoid_1.monoidSum);
            expect(sum([1, 2, 3, 4])).toBe(10);
            expect(sum([1, 2, -3, 4])).toBe(4);
            expect(sum([NaN, 2, 3, 4])).toEqual(NaN);
            expect(sum([])).toBe(0);
        });
        it('Prod', function () {
            var prod = Monoid_1.fold(Monoid_1.monoidProd);
            expect(prod([1, 2, 3, 4])).toBe(24);
            expect(prod([1, 2, -3, 4])).toBe(-24);
            expect(prod([NaN, 2, 3, 4])).toEqual(NaN);
            expect(prod([])).toBe(1);
        });
        it('String', function () {
            var str = Monoid_1.fold(Monoid_1.monoidString);
            expect(str(['Hello ', 'world', '!'])).toBe('Hello world!');
            expect(str([])).toBe('');
        });
        it('Void', function () {
            var vd = Monoid_1.fold(Monoid_1.monoidVoid);
            expect(vd([void 1, void 2])).toBe(void 0);
            expect(vd([])).toBe(void 0);
        });
    });
});
