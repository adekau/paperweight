import { identity } from './Function';
export const fold = (s) => (a, as) => as.reduce(s.concat, a);
export const getFirstSemigroup = () => ({
    concat: identity
});
export const getLastSemigroup = () => ({
    concat: (_, y) => y
});
export const getTupleSemigroup = (...semigroups) => ({
    concat: (x, y) => semigroups.map((s, i) => s.concat(x[i], y[i]))
});
export const getDualSemigroup = (s) => ({
    concat: (x, y) => s.concat(y, x)
});
export const getFunctionSemigroup = (s) => () => ({
    concat: (f, g) => a => s.concat(f(a), g(a))
});
export function getStructSemigroup(semigroups) {
    return {
        concat: (x, y) => {
            const r = {};
            for (const key of Object.keys(semigroups)) {
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
}
;
export const semigroupAll = {
    concat: (x, y) => x && y
};
export const semigroupAny = {
    concat: (x, y) => x || y
};
export const semigroupSum = {
    concat: (x, y) => x + y
};
export const semigroupProd = {
    concat: (x, y) => x * y
};
export const semigroupString = {
    concat: (x, y) => x + y
};
export const semigroupVoid = {
    concat: () => void 0
};
//# sourceMappingURL=Semigroup.js.map