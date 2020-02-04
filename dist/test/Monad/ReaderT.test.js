"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReaderT_1 = require("../../src/Monad/ReaderT");
var Either_1 = require("../../src/Monad/Either");
var Reader_1 = require("../../src/Monad/Reader");
describe('ReaderT', function () {
    var readerEither = ReaderT_1.getReaderM(Either_1.Either);
    var e = function (x) { return x > 0 ? Either_1.inr("value is " + x) : Either_1.inl(Error("Can't be <= 0")); };
    var eR = function (x) { return x > 0 ? "value is " + x : Error("Can't be <= 0"); };
    it('gets reader for other monad', function () {
        var re1 = readerEither.fromM(e(15));
        var re2 = readerEither.fromM(e(0));
        var re3 = readerEither.fromReader(eR);
        expect(re1('')).toEqual(Either_1.inr("value is 15"));
        expect(re2('')).toEqual(Either_1.inl(Error("Can't be <= 0")));
        // Both will be right since it uses Either.of
        expect(re3(5)).toEqual(Either_1.inr("value is 5"));
        expect(re3(0)).toEqual(Either_1.inr(Error("Can't be <= 0")));
    });
    it('maps', function () {
        var re = readerEither.fromReader(Reader_1.Reader.of('hi'));
        var r = readerEither.map(re, function (str) { return str + '!'; });
        expect(r('anything')).toEqual(Either_1.inr("hi!"));
    });
});
//# sourceMappingURL=ReaderT.test.js.map