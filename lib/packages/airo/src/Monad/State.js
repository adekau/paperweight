import { Identity } from './Identity';
import { pipeable } from './Pipeable';
import { getStateM } from './StateT';
;
export const HKTId = 'State';
const T = getStateM(Identity);
export const evalState = T.evalState;
export const execState = T.execState;
export const get = T.get;
export const gets = T.gets;
export const put = T.put;
export const modify = T.modify;
export const State = {
    HKT: HKTId,
    of: T.of,
    ap: T.ap,
    map: T.map,
    bind: T.bind
};
export const StateP = pipeable(State);
//# sourceMappingURL=State.js.map