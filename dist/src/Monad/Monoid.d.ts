import { Semigroup } from './Semigroup';
export declare type Monoid<M> = Semigroup<M> & {
    readonly empty: M;
};
export declare const monoidAll: Monoid<boolean>;
export declare const monoidAny: Monoid<boolean>;
export declare const monoidSum: Monoid<number>;
export declare const monoidProd: Monoid<number>;
export declare const monoidString: Monoid<string>;
export declare const monoidVoid: Monoid<void>;
export declare const fold: <M>(m: Monoid<M>) => (as: M[]) => M;
