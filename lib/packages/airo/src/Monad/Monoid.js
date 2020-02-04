import { semigroupAll, semigroupAny, semigroupProd, semigroupString, semigroupSum, semigroupVoid, fold as foldSemigroup } from './Semigroup';
export const monoidAll = {
    empty: true,
    concat: semigroupAll.concat
};
export const monoidAny = {
    empty: false,
    concat: semigroupAny.concat
};
export const monoidSum = {
    empty: 0,
    concat: semigroupSum.concat
};
export const monoidProd = {
    empty: 1,
    concat: semigroupProd.concat
};
export const monoidString = {
    empty: '',
    concat: semigroupString.concat
};
export const monoidVoid = {
    empty: void 0,
    concat: semigroupVoid.concat
};
export const fold = (m) => (as) => {
    const foldSemigroupM = foldSemigroup(m);
    return foldSemigroupM(m.empty, as);
};
//# sourceMappingURL=Monoid.js.map