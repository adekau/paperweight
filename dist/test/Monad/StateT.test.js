"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("../../src/Monad/Either");
var State_1 = require("../../src/Monad/State");
var StateT_1 = require("../../src/Monad/StateT");
describe('StateT', function () {
    var eitherState = StateT_1.getStateM(Either_1.Either);
    it('from state', function () {
        var s = State_1.State.of(15);
        var s2 = eitherState.fromState(s);
        expect(s2('hi')).toEqual(Either_1.inr([15, 'hi']));
    });
    it('from monad left', function () {
        var e = Either_1.inl(Error('error!'));
        var s = eitherState.fromM(e);
        expect(s('hello')).toEqual(Either_1.inl(Error('error!')));
    });
    it('from monad right', function () {
        var e = Either_1.Either.of('hello');
        var s = eitherState.fromM(e);
        expect(s('world')).toEqual(Either_1.inr(['hello', 'world']));
    });
    it('eval state', function () {
        var s = State_1.State.of('world');
        var result = State_1.evalState(s, 'hello');
        expect(result).toEqual('world');
    });
    it('exec state', function () {
        var s = State_1.State.of('world');
        var result = State_1.execState(s, 'hello');
        expect(result).toEqual('hello');
    });
});
//# sourceMappingURL=StateT.test.js.map