export declare type HKT<TId, A> = {
    readonly _HKT: TId;
    readonly _val: A;
};
export declare type HKT2<TId, E, A> = HKT<TId, A> & {
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
export interface HKTToKind<A> {
}
export interface HKTToKindF<A extends (..._: any[]) => any> {
}
export interface HKTToKind2<E, A> {
}
export declare type HKTS = keyof HKTToKind<any>;
export declare type HKTSF = keyof HKTToKindF<any>;
export declare type HKTS2 = keyof HKTToKind2<any, any>;
export declare type Kind<TId extends HKTS, A> = TId extends HKTS ? HKTToKind<A>[TId] : any;
export declare type KindF<TId extends HKTSF, A extends (..._: any[]) => any> = TId extends HKTSF ? HKTToKindF<A>[TId] : any;
export declare type Kind2<TId extends HKTS2, E, A> = TId extends HKTS2 ? HKTToKind2<E, A>[TId] : any;
//# sourceMappingURL=HKT.d.ts.map