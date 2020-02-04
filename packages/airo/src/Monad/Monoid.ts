import {
    Semigroup,
    semigroupAll,
    semigroupAny,
    semigroupProd,
    semigroupString,
    semigroupSum,
    semigroupVoid,
    fold as foldSemigroup
} from './Semigroup';

export type Monoid<M> = Semigroup<M> & {
    readonly empty: M
};

export const monoidAll: Monoid<boolean> = {
    empty: true,
    concat: semigroupAll.concat
};

export const monoidAny: Monoid<boolean> = {
    empty: false,
    concat: semigroupAny.concat
};

export const monoidSum: Monoid<number> = {
    empty: 0,
    concat: semigroupSum.concat
};

export const monoidProd: Monoid<number> = {
    empty: 1,
    concat: semigroupProd.concat
};

export const monoidString: Monoid<string> = {
    empty: '',
    concat: semigroupString.concat
};

export const monoidVoid: Monoid<void> = {
    empty: void 0,
    concat: semigroupVoid.concat
};

export const fold = <M>(m: Monoid<M>) => (as: M[]): M => {
    const foldSemigroupM = foldSemigroup(m);
    return foldSemigroupM(m.empty, as);
};