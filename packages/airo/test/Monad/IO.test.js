"use strict";
exports.__esModule = true;
var IO_1 = require("../../src/Monad/IO");
var Pipeable_1 = require("../../src/Monad/Pipeable");
var io = IO_1.IO.of('Hello world!');
describe('IO Monad', function () {
    it('constructs', function () {
        expect(io()).toBe('Hello world!');
    });
    it('maps', function () {
        var newIO = IO_1.IO.map(io, function (s) { return s.length; });
        expect(newIO()).toBe(12);
    });
    it('applies', function () {
        var fnIO = IO_1.IO.of(function (x) { return x * 2; });
        expect(IO_1.IO.ap(fnIO, IO_1.IO.of(5))()).toBe(10);
    });
    it('binds/chains', function () {
        var newIO = IO_1.IO.bind(io, function (a) { return IO_1.IO.of(a + ':)'); });
        expect(newIO()).toBe('Hello world!:)');
    });
    it('pipes', function () {
        var t = Pipeable_1.pipe(5, IO_1.of(), IO_1.map(function (x) { return x + 5; }), IO_1.map(function (x) { return x.toString(); }), IO_1.bind(function (x) { return IO_1.IO.of(x + '!'); }));
        expect(t()).toBe('10!');
    });
    it('pipes with actual io', function () {
        console.log = jasmine.createSpy('log');
        var t = Pipeable_1.pipe(5, IO_1.of(), IO_1.map(function (x) { return console.log(x); }));
        expect(t).not.toThrow();
        expect(console.log).toHaveBeenCalled();
    });
});
