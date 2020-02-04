"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("../../src/Monad/Either");
var Maybe_1 = require("../../src/Monad/Maybe");
var Semigroup_1 = require("../../src/Monad/Semigroup");
describe('Semigroup', function () {
    var sgPoint = Semigroup_1.getStructSemigroup({
        x: Semigroup_1.semigroupSum,
        y: Semigroup_1.semigroupSum
    });
    var sgPred = Semigroup_1.getFunctionSemigroup(Semigroup_1.semigroupAll)();
    var p1 = {
        x: 1,
        y: 5
    };
    var p2 = {
        x: 6,
        y: 2
    };
    var p3 = {
        x: 15,
        y: -3
    };
    var p4 = {
        x: -4,
        y: 5
    };
    it('add two points', function () {
        expect(sgPoint.concat(p1, p2)).toEqual({
            x: 7,
            y: 7
        });
    });
    it('function semigroup', function () {
        var isPositiveX = function (p) { return p.x >= 0; };
        var isNegativeY = function (p) { return p.y <= 0; };
        var checkPoint = sgPred.concat(isPositiveX, isNegativeY);
        expect(checkPoint(p1)).toBe(false);
        expect(checkPoint(p2)).toBe(false);
        expect(checkPoint(p3)).toBe(true);
        expect(checkPoint(p4)).toBe(false);
    });
    it('function or semigroup', function () {
        var sgOrPred = Semigroup_1.getFunctionSemigroup(Semigroup_1.semigroupAny)();
        var isPositiveX = function (p) { return p.x >= 0; };
        var isNegativeY = function (p) { return p.y <= 0; };
        var checkPoint = sgOrPred.concat(isPositiveX, isNegativeY);
        expect(checkPoint(p1)).toBe(true);
        expect(checkPoint(p2)).toBe(true);
        expect(checkPoint(p3)).toBe(true);
        expect(checkPoint(p4)).toBe(false);
    });
    it('fold', function () {
        var sum = Semigroup_1.fold(Semigroup_1.semigroupSum);
        var prod = Semigroup_1.fold(Semigroup_1.semigroupProd);
        expect(sum(0, [1, 2, 3, 4])).toBe(10);
        expect(prod(1, [1, 2, 3, 4])).toBe(24);
    });
    it('Maybe semigroup', function () {
        var addMaybe = Maybe_1.getApplySemigroup(Semigroup_1.semigroupSum);
        var multMaybe = Maybe_1.getApplySemigroup(Semigroup_1.semigroupProd);
        expect(addMaybe.concat(Maybe_1.Just(5), Maybe_1.Just(11))).toEqual(Maybe_1.Just(16));
        expect(addMaybe.concat(Maybe_1.Just(5), Maybe_1.Nothing)).toEqual(Maybe_1.Nothing);
        expect(multMaybe.concat(Maybe_1.Just(5), Maybe_1.Just(11))).toEqual(Maybe_1.Just(55));
        expect(multMaybe.concat(Maybe_1.Just(5), Maybe_1.Nothing)).toEqual(Maybe_1.Nothing);
    });
    it('Either semigroup', function () {
        var allEither = Either_1.getApplySemigroup(Semigroup_1.semigroupAll);
        var fnSgEither = Semigroup_1.getFunctionSemigroup(allEither)();
        var ptNot0 = function (p) { return p.x === 0 ? Either_1.inl('error in x') : Either_1.inr(true); };
        var ptLess0 = function (p) { return p.y < 0 ? Either_1.inr(true) : p.y > 0 ? Either_1.inl('error in y') : Either_1.inr(false); };
        var testFn = fnSgEither.concat(ptNot0, ptLess0);
        expect(testFn(p1)).toEqual(Either_1.inl('error in y'));
        expect(testFn(p2)).toEqual(Either_1.inl('error in y'));
        expect(testFn(p3)).toEqual(Either_1.inr(true));
        expect(testFn(p4)).toEqual(Either_1.inl('error in y'));
        expect(testFn({ x: 0, y: -4 })).toEqual(Either_1.inl('error in x'));
        expect(testFn({ x: -1, y: -1 })).toEqual(Either_1.inr(true));
        expect(testFn({ x: -1, y: 0 })).toEqual(Either_1.inr(false));
    });
    it('string semigroup', function () {
        expect(Semigroup_1.semigroupString.concat('Hello', ' world!')).toBe('Hello world!');
    });
    it('tuple semigroup', function () {
        var s = Semigroup_1.getTupleSemigroup(Semigroup_1.semigroupString, Semigroup_1.semigroupSum, Semigroup_1.semigroupVoid);
        expect(s.concat(['hello', 5, void 5], ['!', 16, void 18])).toEqual(['hello!', 21, void 0]);
    });
    it('dual semigroup', function () {
        var s = Semigroup_1.getDualSemigroup(Semigroup_1.semigroupSum);
        expect(s.concat(5, 21)).toBe(26);
        var s2 = Semigroup_1.getDualSemigroup(Semigroup_1.semigroupString);
        expect(s2.concat('hello', 'world')).toBe('worldhello');
    });
    it('last semigroup', function () {
        expect(Semigroup_1.getLastSemigroup().concat(5, 1)).toBe(1);
        expect(Semigroup_1.getLastSemigroup().concat(1, 5)).toBe(5);
        expect(Semigroup_1.getLastSemigroup().concat('hello', 'world')).toBe('world');
    });
    it('first semigroup', function () {
        expect(Semigroup_1.getFirstSemigroup().concat(5, 1)).toBe(5);
        expect(Semigroup_1.getFirstSemigroup().concat(1, 5)).toBe(1);
        expect(Semigroup_1.getFirstSemigroup().concat('hello', 'world')).toBe('hello');
    });
});
//# sourceMappingURL=Semigroup.test.js.map