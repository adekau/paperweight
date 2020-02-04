import { Either, inl, inr } from '../../src/Monad/Either';
import { State, evalState, execState } from '../../src/Monad/State';
import { getStateM } from '../../src/Monad/StateT';

describe('StateT', () => {
    const eitherState = getStateM(Either);

    it('from state', () => {
        const s = State.of(15);
        const s2 = eitherState.fromState(s);

        expect(s2('hi')).toEqual(inr([15, 'hi']));
    });

    it('from monad left', () => {
        const e = inl(Error('error!'));
        const s = eitherState.fromM(e);

        expect(s('hello')).toEqual(inl(Error('error!')));
    });

    it('from monad right', () => {
        const e = Either.of('hello')
        const s = eitherState.fromM(e);

        expect(s('world')).toEqual(inr(['hello', 'world']));
    });

    it('eval state', () => {
        const s = State.of<string, string>('world');
        const result = evalState(s, 'hello');

        expect(result).toEqual('world');
    });

    it('exec state', () => {
        const s = State.of<string, string>('world');
        const result = execState(s, 'hello');

        expect(result).toEqual('hello');
    });
});
