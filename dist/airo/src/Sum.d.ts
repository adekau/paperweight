import { Func } from './Func';
export declare type Sum<T1, T2> = {
    kind: 'left';
    value: T1;
} | {
    kind: 'right';
    value: T2;
};
export declare const inl: <T1, T2>() => Func<T1, Sum<T1, T2>>;
export declare const inr: <T1, T2>() => Func<T2, Sum<T1, T2>>;
export declare const plus: <TFDomain, TGDomain, TRange>(f: (input: TFDomain) => TRange, g: (input: TGDomain) => TRange) => (x: Sum<TFDomain, TGDomain>) => TRange;
export declare const plusMap: <TFDomain, TFRange, TGDomain, TGRange>(f: Func<TFDomain, TFRange>, g: Func<TGDomain, TGRange>) => Func<Sum<TFDomain, TGDomain>, Sum<TFRange, TGRange>>;
export declare const swapSum: <T1, T2>() => Func<Sum<T1, T2>, Sum<T2, T1>>;
