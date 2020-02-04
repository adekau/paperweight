import { pipeable } from './Pipeable';
;
export const HKTId = 'IO';
export const IO = {
    HKT: HKTId,
    map: (fa, f) => () => f(fa()),
    of: (a) => () => a,
    ap: (fab, fa) => () => fab()(fa()),
    bind: (fa, f) => f(fa())
};
export const { ap, apFirst, apSecond, bind, bindFirst, flatten, map, of } = pipeable(IO);
//# sourceMappingURL=IO.js.map