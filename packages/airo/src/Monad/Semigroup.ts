import { identity } from './Function';
import { Magma } from './Magma';

/**
 * A semigroup is a Magma where `concat` is associative.
 * e.g. `(A, +)` with associativity such that:
 *  `+: (x: A, y: A) => A` has the following equivalency `+(+(x, y), z) == +(x, +(y, z))`
 */
export type Semigroup<A> = Magma<A>;

export const fold = <A>(s: Semigroup<A>) => (a: A, as: A[]) => as.reduce(s.concat, a);

export const getFirstSemigroup = <A = never>(): Semigroup<A> => ({
    concat: identity
});

export const getLastSemigroup = <A = never>(): Semigroup<A> => ({
    concat: (_, y) => y
});

export const getTupleSemigroup = <T extends Semigroup<any>[]>(
    ...semigroups: T
): Semigroup<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }> => ({
    concat: (x, y) => semigroups.map((s, i) => s.concat(x[i], y[i])) as any
});

export const getDualSemigroup = <A>(s: Semigroup<A>): Semigroup<A> => ({
    concat: (x, y) => s.concat(y, x)
});

export const getFunctionSemigroup = <S>(s: Semigroup<S>) => <A = never>(): Semigroup<(a: A) => S> => ({
    concat: (f, g) => a => s.concat(f(a), g(a))
});

export function getStructSemigroup<O extends { [key: string]: any }>(
    semigroups: { [K in keyof O]: Semigroup<O[K]> }
): Semigroup<O> {
    return {
        concat: (x, y) => {
            const r: any = {};
            for (const key of Object.keys(semigroups)) {
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
};

export const semigroupAll: Semigroup<boolean> = {
    concat: (x, y) => x && y
};

export const semigroupAny: Semigroup<boolean> = {
    concat: (x, y) => x || y
};

export const semigroupSum: Semigroup<number> = {
    concat: (x, y) => x + y
};

export const semigroupProd: Semigroup<number> = {
    concat: (x, y) => x * y
};

export const semigroupString: Semigroup<string> = {
    concat: (x, y) => x + y
};

export const semigroupVoid: Semigroup<void> = {
    concat: () => void 0
};