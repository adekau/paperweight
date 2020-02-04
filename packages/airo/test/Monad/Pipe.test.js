"use strict";
exports.__esModule = true;
var Maybe_1 = require("../../src/Monad/Maybe");
var Pipeable_1 = require("../../src/Monad/Pipeable");
var incrX = function (x) { return function (v) { return v + x; }; };
var decrX = function (x) { return function (v) { return v - x; }; };
var stringify = function (v) { return v.toString(); };
var exclaim = function (v) { return v + '!'; };
describe('Pipe', function () {
    it('simple pipe', function () {
        var mb = Pipeable_1.pipe(5, incrX(5), decrX(2), stringify, exclaim);
        expect(mb).toBe('8!');
    });
    it('monad pipe', function () {
        var mb = Pipeable_1.pipe(4, Maybe_1.of(), Maybe_1.map(incrX(5)));
        expect(mb).toEqual(Maybe_1.Just(9));
    });
    it('throws error with 0 args', function (done) {
        try {
            expect(Pipeable_1.pipe());
        }
        catch (_a) {
            done();
            return;
        }
        fail('Should not execute pipe');
    });
    it('applies', function () {
        var m = Pipeable_1.pipe(function (x) { return x * 2; }, Maybe_1.of(), Maybe_1.ap(Maybe_1.Just(100)), Maybe_1.bind(function (n) { return Maybe_1.Just(n + 5); }), Maybe_1.bindFirst(function (a) { return Maybe_1.Just(a + 5); }));
        expect(m).toEqual(Maybe_1.Just(205));
        var m2 = Pipeable_1.pipe(function (x) { return x * 2; }, Maybe_1.of(), Maybe_1.ap(Maybe_1.Just(100)), Maybe_1.bind(function (n) { return Maybe_1.Just(n + 5); }), Maybe_1.apSecond(Maybe_1.Just(15)));
        expect(m2).toEqual(Maybe_1.Just(15));
    });
    it('flattens', function () {
        var m = Pipeable_1.pipe(15, Maybe_1.of(), Maybe_1.of());
        expect(m).toEqual(Maybe_1.Just(Maybe_1.Just(15)));
        var m2 = Pipeable_1.pipe(15, Maybe_1.of(), Maybe_1.of(), Maybe_1.flatten);
        expect(m2).toEqual(Maybe_1.Just(15));
    });
});
