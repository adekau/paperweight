"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category_1 = require("../src/Category");
var Func_1 = require("../src/Func");
var Prod_1 = require("../src/Prod");
var State_1 = require("../src/State");
describe('State Monad', function () {
    it('simple state', function () {
        var state = State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return x + '!'; }))
            .then(Prod_1.swapProd()));
        var result = Func_1.apply(state.run, 2);
        expect(result).toEqual({
            fst: "2!",
            snd: 2
        });
    });
    it('state then', function () {
        var state = State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return (x + 1).toString(); }))
            .then(Prod_1.swapProd()));
        var newState = state.then(function (curr) { return State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return !((x + parseInt(curr, 10)) % 2); }))
            .then(Prod_1.swapProd())
            .then(Prod_1.snd()
            .then(Func_1.func(function (x) { return x + parseInt(curr, 10); }))
            .times(Prod_1.fst())
            .then(Prod_1.swapProd()))); });
        var result = Func_1.apply(state.run, 3);
        var result2 = Func_1.apply(newState.run, 3);
        expect(result).toEqual({
            fst: "4",
            snd: 3
        });
        expect(result2).toEqual({
            fst: false,
            snd: 7
        });
    });
    it('state ignore', function () {
        var state = State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return (x + 1).toString(); }))
            .then(Prod_1.swapProd()));
        var result = Func_1.apply(state.ignore().run, 2);
        expect(result).toEqual({
            fst: {},
            snd: 2
        });
    });
    it('state ignoreWith', function () {
        var state = State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return (x + 1).toString(); }))
            .then(Prod_1.swapProd()));
        var result = Func_1.apply(state.ignoreWith('hello').run, 15);
        expect(result).toEqual({
            fst: 'hello',
            snd: 15
        });
    });
    it('state map', function () {
        var state = State_1.createState(Category_1.identity()
            .times(Func_1.func(function (x) { return (x + 1).toString(); }))
            .then(Prod_1.swapProd()));
        var state2 = state.map(Func_1.func(function (s) { return s.length; }));
        var result = Func_1.apply(state.run, 5);
        var result2 = Func_1.apply(state2.run, 16);
        var result3 = Func_1.apply(state2.run, 99);
        expect(result).toEqual({
            fst: "6",
            snd: 5
        });
        expect(result2).toEqual({
            fst: 2,
            snd: 16
        });
        expect(result3).toEqual({
            fst: 3,
            snd: 99
        });
    });
});
//# sourceMappingURL=State.test.js.map