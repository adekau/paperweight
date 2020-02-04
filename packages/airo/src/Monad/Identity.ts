import { identity as idF } from './Function';
import { Monad1 } from './Monad';
import { pipeable } from './Pipeable';

declare module './HKT' {
    interface HKTToKind<A> {
        Identity: Identity<A>;
    }
};

const HKTId = 'Identity';
type HKTId = typeof HKTId;
export type Identity<A> = A;

export const Identity: Monad1<HKTId> = {
    HKT: HKTId,
    of: idF,
    map: (ma, f) => f(ma),
    bind: (ma, f) => f(ma),
    ap: (mab, ma) => mab(ma)
};

export const IdentityP = pipeable(Identity);
