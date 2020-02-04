export function pipe(v, ...fns) {
    if (!fns.length)
        throw Error('Unexpected number of arguments passed to `pipe`.');
    return fns.reduce((acc, curFn) => curFn(acc), v);
}
const isFunctor = (x) => Object.prototype.hasOwnProperty.call(x, 'map')
    && typeof x.map === 'function';
const isApply = (x) => Object.prototype.hasOwnProperty.call(x, 'ap')
    && typeof x.ap === 'function';
const isBindable = (x) => Object.prototype.hasOwnProperty.call(x, 'bind')
    && typeof x.bind === 'function';
const isApplicative = (x) => Object.prototype.hasOwnProperty.call(x, 'of')
    && typeof x.of === 'function';
export function pipeable(I) {
    const r = {};
    if (isFunctor(I)) {
        const map = f => fa => I.map(fa, f);
        r.map = map;
    }
    if (isApply(I)) {
        const ap = fa => fab => I.ap(fab, fa);
        const apFirst = fb => fa => I.ap(I.map(fa, a => () => a), fb);
        const apSecond = (fb) => fa => I.ap(I.map(fa, () => (b) => b), fb);
        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = apSecond;
    }
    if (isBindable(I)) {
        const bind = f => fa => I.bind(fa, f);
        const bindFirst = f => fa => I.bind(fa, a => I.map(f(a), () => a));
        const flatten = mma => I.bind(mma, a => a);
        r.bind = bind;
        r.bindFirst = bindFirst;
        r.flatten = flatten;
    }
    if (isApplicative(I)) {
        const of = () => a => I.of(a);
        r.of = of;
    }
    return r;
}
//# sourceMappingURL=Pipeable.js.map