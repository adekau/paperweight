import { Magma } from './Magma';
/**
 * A semigroup is a Magma where `concat` is associative.
 * e.g. `(A, +)` with associativity such that:
 *  `+: (x: A, y: A) => A` has the following equivalency `+(+(x, y), z) == +(x, +(y, z))`
 */
export declare type Semigroup<A> = Magma<A>;
export declare const fold: <A>(s: Magma<A>) => (a: A, as: A[]) => A;
export declare const getFirstSemigroup: <A = never>() => Magma<A>;
export declare const getLastSemigroup: <A = never>() => Magma<A>;
export declare const getTupleSemigroup: <T extends Magma<any>[]>(...semigroups: T) => Magma<{ [K in keyof T]: T[K] extends Magma<infer A> ? A : never; }>;
export declare const getDualSemigroup: <A>(s: Magma<A>) => Magma<A>;
export declare const getFunctionSemigroup: <S>(s: Magma<S>) => <A = never>() => Magma<(a: A) => S>;
export declare function getStructSemigroup<O extends {
    [key: string]: any;
}>(semigroups: {
    [K in keyof O]: Semigroup<O[K]>;
}): Semigroup<O>;
export declare const semigroupAll: Semigroup<boolean>;
export declare const semigroupAny: Semigroup<boolean>;
export declare const semigroupSum: Semigroup<number>;
export declare const semigroupProd: Semigroup<number>;
export declare const semigroupString: Semigroup<string>;
export declare const semigroupVoid: Semigroup<void>;
//# sourceMappingURL=Semigroup.d.ts.map