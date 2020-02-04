"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../../src/Monad/Maybe");
describe('Maybe Monad', function () {
    it('just', function () {
        expect(Maybe_1.Maybe.of(55)).toEqual(Maybe_1.Just(55));
    });
    it('none', function () {
        expect(Maybe_1.Maybe.bind(Maybe_1.Maybe.of(55), function (_) { return Maybe_1.Nothing; })).toEqual(Maybe_1.Nothing);
    });
    it('bind', function () {
        expect(Maybe_1.Maybe.bind(Maybe_1.Maybe.of(55), function (result) { return Maybe_1.Just(result + 5); })).toEqual(Maybe_1.Just(60));
    });
    it('map', function () {
        expect(Maybe_1.Maybe.map(Maybe_1.Maybe.of(55), function (result) { return result + 5; })).toEqual(Maybe_1.Just(60));
    });
    it('apply', function () {
        expect(Maybe_1.Maybe.ap(Maybe_1.Just(function (a) { return !a; }), Maybe_1.Just(false))).toEqual(Maybe_1.Just(true));
    });
    it('pipeable fn', function () {
        expect(Maybe_1.apFirst(Maybe_1.Just(5))(Maybe_1.Just('hi'))).toEqual(Maybe_1.Just('hi'));
        expect(Maybe_1.apSecond(Maybe_1.Just(5))(Maybe_1.Just('hi'))).toEqual(Maybe_1.Just(5));
    });
    it('fold', function () {
        var div = function (num1, num2) { return num2 === 0 ? Maybe_1.Nothing : Maybe_1.Just(num1 / num2); };
        var fld = Maybe_1.fold(function () { return 0; }, function (v) { return v; });
        expect(fld(div(15, 0))).toBe(0);
        expect(fld(div(15, 3))).toBe(5);
        expect(fld(div(-15, 3))).toBe(-5);
        expect(fld(div(NaN, 0))).toBe(0);
    });
});
//# sourceMappingURL=Maybe.test.js.map