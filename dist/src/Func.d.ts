import { Prod } from "./Prod";
import { Sum } from './Sum';
export declare type Func<TDomain, TRange> = {
    f: (domain: TDomain) => TRange;
    after: <TPreComposition>(g: Func<TPreComposition, TDomain>) => Func<TPreComposition, TRange>;
    then: <TPostComposition>(g: Func<TRange, TPostComposition>) => Func<TDomain, TPostComposition>;
    times: <T2Range>(g: Func<TDomain, T2Range>) => Func<TDomain, Prod<TRange, T2Range>>;
    timesMap: <TGDomain, TGRange>(g: Func<TGDomain, TGRange>) => Func<Prod<TDomain, TGDomain>, Prod<TRange, TGRange>>;
    plus: <TGDomain>(g: Func<TGDomain, TRange>) => Func<Sum<TDomain, TGDomain>, TRange>;
    plusMap: <TGDomain, TGRange>(g: Func<TGDomain, TGRange>) => Func<Sum<TDomain, TGDomain>, Sum<TRange, TGRange>>;
};
export declare const func: <TDomain, TRange>(f: (domain: TDomain) => TRange) => Func<TDomain, TRange>;
export declare const curry: <T1, T2, TRange>(f: Func<Prod<T1, T2>, TRange>) => Func<T1, Func<T2, TRange>>;
export declare const apply: <TDomain, TRange>(f: Func<TDomain, TRange>, x: TDomain) => TRange;
export declare const applyPair: <TDomain, TRange>() => Func<Prod<Func<TDomain, TRange>, TDomain>, TRange>;
export declare const distSumProd: <A, B, C>() => Func<Prod<A, Sum<B, C>>, Sum<Prod<A, B>, Prod<A, C>>>;
export declare const factorSumProd: <A, B, C>() => Func<Sum<Prod<A, B>, Prod<A, C>>, Prod<A, Sum<B, C>>>;
