import { Monoid } from './Monoid';
import { Semigroup } from './Semigroup';
import { Monad2 } from './Monad';
declare module './HKT' {
    interface HKTToKind2<E, A> {
        Reader: Reader<E, A>;
    }
}
export declare const HKTId = "Reader";
export declare type HKTId = typeof HKTId;
export declare type Reader<R, A> = {
    (r: R): A;
};
export declare const ask: <R>() => Reader<R, R>;
export declare const asks: <R, A>(f: (r: R) => A) => Reader<R, A>;
export declare function local<Q, R>(f: (d: Q) => R): <A>(ma: Reader<R, A>) => Reader<Q, A>;
export declare function getSemigroup<R, A>(s: Semigroup<A>): Semigroup<Reader<R, A>>;
export declare function getMonoid<R, A>(m: Monoid<A>): Monoid<Reader<R, A>>;
export declare const Reader: Monad2<HKTId>;
export declare const ap: <E, A, B>(fa: Reader<E, A>) => (fab: Reader<E, (a: A) => B>) => Reader<E, B>, apFirst: <E, B>(fb: Reader<E, B>) => <A>(fa: Reader<E, A>) => Reader<E, A>, apSecond: <E, B>(fb: Reader<E, B>) => <A>(fa: Reader<E, A>) => Reader<E, B>, bind: <E, A, B>(f: (a: A) => Reader<E, B>) => (fa: Reader<E, A>) => Reader<E, B>, bindFirst: <E, A, B>(f: (a: A) => Reader<E, B>) => (fa: Reader<E, A>) => Reader<E, A>, map: <E, A, B>(f: (a: A) => B) => (fa: Reader<E, A>) => Reader<E, B>, of: <E, A>() => (a: A) => Reader<E, A>;
//# sourceMappingURL=Reader.d.ts.map