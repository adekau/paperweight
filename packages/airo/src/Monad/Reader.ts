import { Identity } from './Identity';
import { Monoid } from './Monoid';
import { getReaderM } from './ReaderT';
import { Semigroup } from './Semigroup';
import { Monad2 } from './Monad';
import { pipeable } from './Pipeable';

declare module './HKT' {
    interface HKTToKind2<E, A> {
        Reader: Reader<E, A>;
    }
}

export const HKTId = 'Reader';
export type HKTId = typeof HKTId;

const T = getReaderM(Identity);

export type Reader<R, A> = {
    (r: R): A
};

export const ask: <R>() => Reader<R, R> = T.ask;
export const asks: <R, A>(f: (r: R) => A) => Reader<R, A> = T.asks;

export function local<Q, R>(f: (d: Q) => R): <A>(ma: Reader<R, A>) => Reader<Q, A> {
    return ma => T.local(ma, f);
};

export function getSemigroup<R, A>(s: Semigroup<A>): Semigroup<Reader<R, A>> {
    return {
        concat: (x, y) => e => s.concat(x(e), y(e))
    };
};

export function getMonoid<R, A>(m: Monoid<A>): Monoid<Reader<R, A>> {
    return {
        concat: getSemigroup<R, A>(m).concat,
        empty: () => m.empty
    };
};

export const Reader: Monad2<HKTId> = {
    HKT: HKTId,
    of: T.of,
    map: (ma, f) => e => f(ma(e)),
    ap: T.ap,
    bind: T.bind
};

export const ReaderP = pipeable(Reader);
