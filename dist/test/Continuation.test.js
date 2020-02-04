"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Continuation_1 = require("../src/Continuation");
describe('Continuation Monad', function () {
    it('bind same type', function () {
        var c = new Continuation_1.Cont(function (resolve) { return resolve(5); }).bind(function (x) { return Continuation_1.Cont.of(x + 5); });
        expect(c.run(Continuation_1.Cont.id())).toBe(10);
    });
    it('bind different type', function () {
        var c = new Continuation_1.Cont(function (resolve) { return resolve(15); })
            .bind(function (res) { return Continuation_1.Cont.of(res.toString() + '!'); })
            .bind(function (res2) { return new Continuation_1.Cont(function (resolve2) { return resolve2(!!res2.length); }); });
        expect(c.run(Continuation_1.Cont.id())).toBe(true);
    });
    it('map', function () {
        var c = Continuation_1.Cont.of(5)
            .map(function (result) { return result.toString() + '!'; });
        var result = c.run(Continuation_1.Cont.id());
        expect(result).toBe('5!');
    });
    it('async', function (done) {
        var c = Continuation_1.Cont.of('hello')
            .bind(function (result) { return new Continuation_1.Cont(function (resolve) { return setTimeout(function () { return resolve(result + ' world'); }, 250); }); })
            .bind(function (result) { return new Continuation_1.Cont(function (resolve) { return setTimeout(function () { return resolve(result + '!'); }, 250); }); });
        c.run(function (result) {
            expect(result).toBe('hello world!');
            done();
        });
    });
});
//# sourceMappingURL=Continuation.test.js.map