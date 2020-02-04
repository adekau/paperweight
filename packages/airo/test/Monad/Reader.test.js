"use strict";
exports.__esModule = true;
var Reader_1 = require("../../src/Monad/Reader");
var Console_1 = require("../../src/Monad/Console");
var Semigroup_1 = require("../../src/Monad/Semigroup");
var Monoid_1 = require("../../src/Monad/Monoid");
var Pipeable_1 = require("../../src/Monad/Pipeable");
describe('Reader Monad', function () {
    it('lifts', function () {
        var r = Reader_1.Reader.of(5);
        expect(r(10)).toBe(5);
        expect(r(5000)).toBe(5);
        expect(r(-100)).toBe(5);
        expect(r('hello')).toBe(5);
        expect(r(false)).toBe(5);
    });
    it('maps', function () {
        var r = function (n) { return "Your number is " + n; };
        console.log = jasmine.createSpy('log');
        var r2 = Reader_1.Reader.map(r, function (str) { return Console_1.log(str); });
        r2(15)();
        expect(console.log).toHaveBeenCalledWith('Your number is 15');
    });
    it('binds', function () {
        var r = function (n) { return "Your number is " + n; };
        console.log = jasmine.createSpy('log');
        var r2 = Reader_1.Reader.bind(r, function (str) { return Reader_1.Reader.of(Console_1.log(str)); });
        r2(15)();
        expect(console.log).toHaveBeenCalledWith('Your number is 15');
    });
    it('applies', function () {
        var r = Reader_1.Reader.of(function (x) { return x * 2; });
        var result = Reader_1.Reader.ap(r, Reader_1.Reader.of(5));
        expect(result('anything')).toBe(10);
    });
    it('local', function () {
        var mult2 = function (x) { return x * 2; };
        var l = Reader_1.local(mult2);
        var r = function (n) { return "Your number is " + n; };
        expect(l(r)(5)).toEqual('Your number is 10');
    });
    describe('Semigroup', function () {
        it('concats', function () {
            var s = Reader_1.getSemigroup(Semigroup_1.semigroupSum);
            var s2 = Reader_1.getSemigroup(Semigroup_1.semigroupProd);
            var r = s.concat(Reader_1.Reader.of(5), Reader_1.Reader.of(68));
            var r2 = s2.concat(Reader_1.Reader.of(5), Reader_1.Reader.of(68));
            expect(r('anything')).toBe(5 + 68);
            expect(r2('anything')).toBe(5 * 68);
        });
    });
    describe('Monoid', function () {
        it('folds', function () {
            var m = Reader_1.getMonoid(Monoid_1.monoidSum);
            var m2 = Reader_1.getMonoid(Monoid_1.monoidProd);
            var r = Monoid_1.fold(m)([Reader_1.Reader.of(5), Reader_1.Reader.of(68)]);
            var r2 = Monoid_1.fold(m2)([Reader_1.Reader.of(5), Reader_1.Reader.of(68)]);
            expect(r('anything')).toBe(5 + 68);
            expect(r2('anything')).toBe(5 * 68);
        });
    });
    describe('Environment', function () {
        ;
        var r = function (n) { return function (deps) { return n ? "Data for " + deps.id + ": " + deps.data : "Must equal id"; }; };
        it('dependency injection', function () {
            var f = function (n) { return Pipeable_1.pipe(Reader_1.ask(), Reader_1.bind(function (deps) { return r(n === deps.id); })); };
            var deps = {
                id: 5,
                data: 'Hello world!'
            };
            expect(f(4)(deps)).toBe("Must equal id");
            expect(f(5)(deps)).toBe("Data for 5: Hello world!");
        });
        it('dependency injection', function () {
            var f = function (n) { return Pipeable_1.pipe(Reader_1.asks(function (deps) { return deps.id; }), Reader_1.bind(function (id) { return r(n === id); })); };
            var deps = {
                id: 5,
                data: 'Hello world!'
            };
            expect(f(4)(deps)).toBe("Must equal id");
            expect(f(5)(deps)).toBe("Data for 5: Hello world!");
        });
    });
});
