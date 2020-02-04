"use strict";
exports.__esModule = true;
var State_1 = require("../../src/Monad/State");
var Pipeable_1 = require("../../src/Monad/Pipeable");
describe('State Monad', function () {
    ;
    var deps = { id: 5, data: 'hello world!' };
    var state = State_1.State.of('hello');
    it('lifts', function () {
        expect(state(deps)).toEqual(['hello', deps]);
    });
    it('maps', function () {
        var state2 = State_1.State.map(state, function (s) { return s.length > 2; });
        expect(state2(deps)).toEqual([true, deps]);
    });
    it('applies', function () {
        var s = State_1.State.of(function (x) { return x * 2; });
        var result = State_1.State.ap(s, State_1.State.of(15));
        expect(result(deps)).toEqual([30, deps]);
    });
    it('binds', function () {
        var state2 = State_1.State.bind(state, function (s) { return State_1.State.of(s.length > 2); });
        expect(state2(deps)).toEqual([true, deps]);
    });
    it('get', function () {
        var s = Pipeable_1.pipe(State_1.get(), State_1.StateP.map(function (deps) { return deps.data.length; }));
        expect(s(deps)).toEqual([12, deps]);
    });
    it('gets', function () {
        var s = Pipeable_1.pipe(State_1.gets(function (s) { return s.data; }), State_1.StateP.map(function (d) { return d.length; }));
        expect(s(deps)).toEqual([12, deps]);
    });
    it('modify', function () {
        var s = Pipeable_1.pipe(deps, State_1.modify(function (s) { return ({ id: s.id + 1, data: s.data }); }));
        expect(s).toEqual([void 0, { id: 6, data: deps.data }]);
    });
    it('put', function () {
        var s = Pipeable_1.pipe(deps, State_1.put({ id: deps.id + 5, data: deps.data }));
        expect(s).toEqual([void 0, { id: 10, data: deps.data }]);
    });
});
