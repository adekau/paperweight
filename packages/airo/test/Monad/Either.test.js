"use strict";
exports.__esModule = true;
var Either_1 = require("../../src/Monad/Either");
var badVal = 'Bad value';
var falsyIsError = function (val) {
    return !!val === true ? Either_1.inr(val) : Either_1.inl(badVal);
};
describe('Either Monad', function () {
    it('left value', function () {
        expect(falsyIsError(false)).toEqual(Either_1.inl(badVal));
        expect(falsyIsError(0)).toEqual(Either_1.inl(badVal));
        expect(falsyIsError('')).toEqual(Either_1.inl(badVal));
        expect(falsyIsError(undefined)).toEqual(Either_1.inl(badVal));
        expect(falsyIsError(null)).toEqual(Either_1.inl(badVal));
        expect(falsyIsError(void 0)).toEqual(Either_1.inl(badVal));
    });
    it('right value', function () {
        expect(falsyIsError(15)).toEqual(Either_1.inr(15));
        expect(falsyIsError('hello')).toEqual(Either_1.inr('hello'));
        expect(falsyIsError(true)).toEqual(Either_1.inr(true));
        expect(falsyIsError({})).toEqual(Either_1.inr({}));
    });
    it('maps a value', function () {
        var newVal = Either_1.Either.map(falsyIsError(5), function (x) { return x * 2; });
        expect(newVal).toEqual(Either_1.inr(10));
    });
    it('applies a function', function () {
        var fn = Either_1.inr(function (x) { return x * 2; });
        var result = Either_1.Either.ap(fn, Either_1.inr(16));
        expect(result).toEqual(Either_1.inr(32));
    });
    it('returns left if fn is left', function () {
        var fn = Either_1.inl('no fn here');
        var result = Either_1.Either.ap(fn, Either_1.inr(16));
        expect(result).toEqual(Either_1.inl('no fn here'));
    });
    it('returns left if "a" is left', function () {
        var fn = Either_1.inr(function (x) { return x * 2; });
        var result = Either_1.Either.ap(fn, Either_1.inl('no val here'));
        expect(result).toEqual(Either_1.inl('no val here'));
    });
    it('constructs', function () {
        expect(Either_1.Either.of('hello')).toEqual(Either_1.inr('hello'));
    });
    it('can be chained', function () {
        var first = Either_1.Either.of('hi');
        expect(Either_1.Either.bind(first, function (a) { return Either_1.inr(a + ' world'); })).toEqual(Either_1.inr('hi world'));
    });
    it('is foldable', function () {
        var first = Either_1.Either.of(15);
        var result = Either_1.fold(function (_) { return false; }, function (x) { return x > 5 ? true : false; })(first);
        expect(result).toBe(true);
    });
});
