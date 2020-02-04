import { Monad2 } from './Monad';
declare module './HKT' {
    interface HKTToKind2<E, A> {
        Either: Either<E, A>;
    }
}
export declare const HKTId = "Either";
export declare type HKTId = typeof HKTId;
export declare type Left<E> = {
    _tag: 'Left';
    left: E;
};
export declare type Right<A> = {
    _tag: 'Right';
    right: A;
};
export declare type Either<E, A> = Left<E> | Right<A>;
export declare const inl: <E = never, A = never>(left: E) => Either<E, A>;
export declare const inr: <E = never, A = never>(right: A) => Either<E, A>;
export declare const isLeft: <E, A>(ma: Either<E, A>) => ma is Left<E>;
export declare const isRight: <E, A>(ma: Either<E, A>) => ma is Right<A>;
export declare const fold: <E, A, B>(onLeft: (left: E) => B, onRight: (right: A) => B) => (ma: Either<E, A>) => B;
export declare const getApplySemigroup: <E, A>(s: import("./Magma").Magma<A>) => import("./Magma").Magma<Either<E, A>>;
export declare const Either: Monad2<HKTId>;
export declare const ap: <E, A, B>(fa: Either<E, A>) => (fab: Either<E, (a: A) => B>) => Either<E, B>, apFirst: <E, B>(fb: Either<E, B>) => <A>(fa: Either<E, A>) => Either<E, A>, apSecond: <E, B>(fb: Either<E, B>) => <A>(fa: Either<E, A>) => Either<E, B>, bind: <E, A, B>(f: (a: A) => Either<E, B>) => (fa: Either<E, A>) => Either<E, B>, bindFirst: <E, A, B>(f: (a: A) => Either<E, B>) => (fa: Either<E, A>) => Either<E, A>, flatten: <E, A>(mma: Either<E, Either<E, A>>) => Either<E, A>, map: <E, A, B>(f: (a: A) => B) => (fa: Either<E, A>) => Either<E, B>, of: <E, A>() => (a: A) => Either<E, A>;
//# sourceMappingURL=Either.d.ts.map