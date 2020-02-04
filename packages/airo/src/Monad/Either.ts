import { Monad2 } from './Monad';
import { pipeable } from './Pipeable';
import { Semigroup } from './Semigroup';

declare module './HKT' {
    interface HKTToKind2<E, A> {
        Either: Either<E, A>;
    }
}

const HKTId = 'Either';
type HKTId = typeof HKTId;

export type Left<E> = {
    _tag: 'Left';
    left: E;
};

export type Right<A> = {
    _tag: 'Right';
    right: A;
};

export type Either<E, A> = Left<E> | Right<A>;

export const inl = <E = never, A = never>(left: E): Either<E, A> => ({ _tag: 'Left', left });
export const inr = <E = never, A = never>(right: A): Either<E, A> => ({ _tag: 'Right', right });
export const isLeft = <E, A>(ma: Either<E, A>): ma is Left<E> => ma._tag === 'Left';
export const isRight = <E, A>(ma: Either<E, A>): ma is Right<A> => ma._tag === 'Right';

export const fold = <E, A, B>(onLeft: (left: E) => B, onRight: (right: A) => B) =>
    (ma: Either<E, A>) => isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);

export const getApplySemigroup = <E, A>(s: Semigroup<A>): Semigroup<Either<E, A>> => ({
    concat: (x, y) => isLeft(x) ? x : isLeft(y) ? y : inr(s.concat(x.right, y.right))
});

export const Either: Monad2<HKTId> = {
    HKT: HKTId,

    map: <E, A, B>(fa: Either<E, A>, f: (a: A) => B): Either<E, B> =>
        isLeft(fa) ? fa : inr(f(fa.right)),

    ap: (fab, fa) => {
        if (isLeft(fab))
            return fab;
        if (isLeft(fa))
            return fa;
        return inr(fab.right(fa.right));
    },

    of: a => inr(a),

    bind: (fa, f) => (isLeft(fa)) ? fa : f(fa.right)
};

export const EitherP = pipeable(Either);
