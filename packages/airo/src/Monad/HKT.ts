export type HKT<TId, A> = {
    readonly _HKT: TId;
    readonly _val: A;
};

export type HKT2<TId, E, A> = HKT<TId, A> & {
    readonly _error: E;
};

/**
 * Valid HKT Ids are merged into this (https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * from module declarations in monad files.
 * @example
 * ```
 * declare module './HKT' {
 *     interface HKTToKind<A> {
 *         SomeMonadName: SomeMonadName<A>
 *     }
 * };
 * ```
 */
export interface HKTToKind<A> {};
export interface HKTToKindF<A extends (..._: any[]) => any> {};
export interface HKTToKind2<E, A> {};

export type HKTS = keyof HKTToKind<any>;
export type HKTSF = keyof HKTToKindF<any>;
export type HKTS2 = keyof HKTToKind2<any, any>;

export type Kind<TId extends HKTS, A> = TId extends HKTS ? HKTToKind<A>[TId] : any;
export type KindF<TId extends HKTSF, A extends (..._: any[]) => any> = TId extends HKTSF ? HKTToKindF<A>[TId] : any;
export type Kind2<TId extends HKTS2, E, A> = TId extends HKTS2 ? HKTToKind2<E, A>[TId] : any;
