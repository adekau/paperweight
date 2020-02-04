import { pipeable } from './Pipeable';
export const HKTId = 'Either';
export const inl = (left) => ({ _tag: 'Left', left });
export const inr = (right) => ({ _tag: 'Right', right });
export const isLeft = (ma) => ma._tag === 'Left';
export const isRight = (ma) => ma._tag === 'Right';
export const fold = (onLeft, onRight) => (ma) => isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
export const getApplySemigroup = (s) => ({
    concat: (x, y) => isLeft(x) ? x : isLeft(y) ? y : inr(s.concat(x.right, y.right))
});
export const Either = {
    HKT: HKTId,
    map: (fa, f) => isLeft(fa) ? fa : inr(f(fa.right)),
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
export const { ap, apFirst, apSecond, bind, bindFirst, flatten, map, of } = pipeable(Either);
//# sourceMappingURL=Either.js.map