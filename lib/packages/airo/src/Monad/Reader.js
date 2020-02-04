import { Identity } from './Identity';
import { getReaderM } from './ReaderT';
import { pipeable } from './Pipeable';
export const HKTId = 'Reader';
const T = getReaderM(Identity);
export const ask = T.ask;
export const asks = T.asks;
export function local(f) {
    return ma => T.local(ma, f);
}
;
export function getSemigroup(s) {
    return {
        concat: (x, y) => e => s.concat(x(e), y(e))
    };
}
;
export function getMonoid(m) {
    return {
        concat: getSemigroup(m).concat,
        empty: () => m.empty
    };
}
;
export const Reader = {
    HKT: HKTId,
    of: T.of,
    map: (ma, f) => e => f(ma(e)),
    ap: T.ap,
    bind: T.bind
};
export const { ap, apFirst, apSecond, bind, bindFirst, map, of } = pipeable(Reader);
//# sourceMappingURL=Reader.js.map