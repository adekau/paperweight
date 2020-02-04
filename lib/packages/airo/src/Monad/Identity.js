import { identity as idF } from './Function';
import { pipeable } from './Pipeable';
;
export const HKTId = 'Identity';
export const Identity = {
    HKT: HKTId,
    of: idF,
    map: (ma, f) => f(ma),
    bind: (ma, f) => f(ma),
    ap: (mab, ma) => mab(ma)
};
export const { ap, apFirst, apSecond, bind, bindFirst, map, of } = pipeable(Identity);
//# sourceMappingURL=Identity.js.map