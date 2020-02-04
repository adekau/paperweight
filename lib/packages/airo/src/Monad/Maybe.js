import { pipeable } from './Pipeable';
// Identifier of the higher-kinded type to use for this monad.
export const HKTId = 'Maybe';
export const Nothing = { _tag: 'Nothing' };
export const Just = (value) => ({ _tag: 'Just', value });
export const isJust = (m) => m._tag === 'Just';
export const isNothing = (m) => m._tag === 'Nothing';
export const fold = (onNothing, onJust) => m => (isNothing(m) ? onNothing() : onJust(m.value));
export const getApplySemigroup = (s) => ({
    concat: (x, y) => (isJust(x) && isJust(y)) ? Just(s.concat(x.value, y.value)) : Nothing
});
export const Maybe = {
    HKT: HKTId,
    map: (ma, f) => (isNothing(ma) ? Nothing : Just(f(ma.value))),
    ap: (fab, fa) => isNothing(fab) || isNothing(fa) ? Nothing : Just(fab.value(fa.value)),
    of: (a) => Just(a),
    bind: (fa, f) => isNothing(fa) ? Nothing : f(fa.value)
};
export const { ap, apFirst, apSecond, bind, bindFirst, flatten, map, of } = pipeable(Maybe);
//# sourceMappingURL=Maybe.js.map