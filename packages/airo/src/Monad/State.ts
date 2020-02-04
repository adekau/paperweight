import { Identity } from './Identity';
import { Monad2 } from './Monad';
import { pipeable } from './Pipeable';
import { getStateM } from './StateT';

declare module './HKT' {
    interface HKTToKind2<E, A> {
        State: State<E, A>;
    }
};

const HKTId = 'State';
type HKTId = typeof HKTId;
export type State<S, A> = (s: S) => [A, S];
const T = getStateM(Identity);

export const evalState: <S, A>(ma: State<S, A>, s: S) => A = T.evalState;
export const execState: <S, A>(ma: State<S, A>, s: S) => S = T.execState;
export const get: <S>() => State<S, S> = T.get;
export const gets: <S, A>(f: (s: S) => A) => State<S, A> = T.gets;
export const put: <S>(s: S) => State<S, void> = T.put;
export const modify: <S>(f: (s: S) => S) => State<S, void> = T.modify;

export const State: Monad2<HKTId> = {
    HKT: HKTId,
    of: T.of,
    ap: T.ap,
    map: T.map,
    bind: T.bind
};

export const StateP = pipeable(State);
