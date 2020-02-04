import { State, StateP, get, gets, put, modify } from '../../src/Monad/State';
import { pipe } from '../../src/Monad/Pipeable';

describe('State Monad', () => {
    interface Dependencies {
        id: number;
        data: string;
    };

    const deps: Dependencies = { id: 5, data: 'hello world!' };
    const state = State.of<Dependencies, string>('hello');

    it('lifts', () => {
        expect(state(deps)).toEqual(['hello', deps]);
    });

    it('maps', () => {
        const state2 = State.map(state, s => s.length > 2);

        expect(state2(deps)).toEqual([true, deps]);
    });

    it('applies', () => {
        const s = State.of<Dependencies, (x: number) => number>((x: number) => x * 2);
        const result = State.ap(s, State.of<Dependencies, number>(15));

        expect(result(deps)).toEqual([30, deps]);
    });

    it('binds', () => {
        const state2 = State.bind(state, s => State.of(s.length > 2));

        expect(state2(deps)).toEqual([true, deps]);
    });

    it('get', () => {
        const s = pipe(
            get<Dependencies>(),
            StateP.map(deps => deps.data.length)
        );

        expect(s(deps)).toEqual([12, deps]);
    });

    it('gets', () => {
        const s = pipe(
            gets<Dependencies, string>(s => s.data),
            StateP.map(d => d.length)
        );

        expect(s(deps)).toEqual([12, deps]);
    });

    it('modify', () => {
        const s = pipe(
            deps,
            modify(s => ({ id: s.id + 1, data: s.data }))
        );

        expect(s).toEqual([void 0, { id: 6, data: deps.data }]);
    });

    it('put', () => {
        const s = pipe(deps, put<Dependencies>({ id: deps.id + 5, data: deps.data }));

        expect(s).toEqual([void 0, { id: 10, data: deps.data }]);
    });
});
