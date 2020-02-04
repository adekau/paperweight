import { Monad1 } from './Monad';
import { pipeable } from './Pipeable';
import { Semigroup } from './Semigroup';

// Declares Maybe as a valid higher-kinded type.
// Re-declaring HKTToKind here causes the declaration to merge (HKTToKind & { ... })
declare module './HKT' {
    interface HKTToKind<A> {
        Maybe: Maybe<A>
    }
}

// Identifier of the higher-kinded type to use for this monad.
const HKTId = 'Maybe';
type HKTId = typeof HKTId;

export type Nothing = {
    readonly _tag: 'Nothing';
};

export type Just<A> = {
    readonly _tag: 'Just';
    readonly value: A;
};

export type Maybe<A> = Nothing | Just<A>;

export const Nothing: Maybe<never> = { _tag: 'Nothing' };
export const Just = <A>(value: A): Maybe<A> => ({ _tag: 'Just', value });
export const isJust = <A>(m: Maybe<A>): m is Just<A> => m._tag === 'Just';
export const isNothing = <A>(m: Maybe<A>): m is Nothing => m._tag === 'Nothing';
export const fold = <A, B>(onNothing: () => B, onJust: (value: A) => B): ((m: Maybe<A>) => B) =>
    m => (isNothing(m) ? onNothing() : onJust(m.value));

export const getApplySemigroup = <A>(s: Semigroup<A>): Semigroup<Maybe<A>> => ({
    concat: (x, y) => (isJust(x) && isJust(y)) ? Just(s.concat(x.value, y.value)) : Nothing
});

export const Maybe: Monad1<HKTId> = {
    HKT: HKTId,

    map: (ma, f) =>
        (isNothing(ma) ? Nothing : Just(f(ma.value))),

    ap: <A, B>(fab: Maybe<(a: A) => B>, fa: Maybe<A>) =>
        isNothing(fab) || isNothing(fa) ? Nothing : Just(fab.value(fa.value)),

    of: <A>(a: A) => Just(a),

    bind: <A, B>(fa: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> =>
        isNothing(fa) ? Nothing : f(fa.value)
};

export const MaybeP = pipeable(Maybe);
