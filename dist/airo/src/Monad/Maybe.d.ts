import { Monad1 } from './Monad';
declare module './HKT' {
    interface HKTToKind<A> {
        Maybe: Maybe<A>;
    }
}
export declare const HKTId = "Maybe";
export declare type HKTId = typeof HKTId;
export declare type Nothing = {
    readonly _tag: 'Nothing';
};
export declare type Just<A> = {
    readonly _tag: 'Just';
    readonly value: A;
};
export declare type Maybe<A> = Nothing | Just<A>;
export declare const Nothing: Maybe<never>;
export declare const Just: <A>(value: A) => Maybe<A>;
export declare const isJust: <A>(m: Maybe<A>) => m is Just<A>;
export declare const isNothing: <A>(m: Maybe<A>) => m is Nothing;
export declare const fold: <A, B>(onNothing: () => B, onJust: (value: A) => B) => (m: Maybe<A>) => B;
export declare const getApplySemigroup: <A>(s: import("./Magma").Magma<A>) => import("./Magma").Magma<Maybe<A>>;
export declare const Maybe: Monad1<HKTId>;
export declare const ap: <A, B>(fa: Maybe<A>) => (fab: Maybe<(a: A) => B>) => Maybe<B>, apFirst: <B>(fb: Maybe<B>) => <A>(fa: Maybe<A>) => Maybe<A>, apSecond: <B>(fb: Maybe<B>) => <A>(fa: Maybe<A>) => Maybe<B>, bind: <A, B>(f: (a: A) => Maybe<B>) => (fa: Maybe<A>) => Maybe<B>, bindFirst: <A, B>(f: (a: A) => Maybe<B>) => (fa: Maybe<A>) => Maybe<A>, flatten: <A>(mma: Maybe<Maybe<A>>) => Maybe<A>, map: <A, B>(f: (a: A) => B) => (fa: Maybe<A>) => Maybe<B>, of: <A>() => (a: A) => Maybe<A>;
