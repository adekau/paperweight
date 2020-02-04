import { Func } from "./Func";
export declare type Prod<T1, T2> = {
    fst: T1;
    snd: T2;
};
export declare const times: <TDomain, T1, T2>(f: (input: TDomain) => T1, g: (input: TDomain) => T2) => (constructorInput: TDomain) => Prod<T1, T2>;
export declare const fst: <T1, T2>() => Func<Prod<T1, T2>, T1>;
export declare const snd: <T1, T2>() => Func<Prod<T1, T2>, T2>;
export declare const timesMap: <T1Prod1, T2Prod1, T1Prod2, T2Prod2>(f: Func<T1Prod1, T1Prod2>, g: Func<T2Prod1, T2Prod2>) => Func<Prod<T1Prod1, T2Prod1>, Prod<T1Prod2, T2Prod2>>;
export declare const swapProd: <T1, T2>() => Func<Prod<T1, T2>, Prod<T2, T1>>;
