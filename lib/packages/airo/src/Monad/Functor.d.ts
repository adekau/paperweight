import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';
export declare type Functor<F> = {
    readonly HKT: F;
    readonly map: <A, B>(fa: HKT<F, A>, f: (a: A) => B) => HKT<F, B>;
};
export declare type FunctorF1<F extends HKTSF> = {
    readonly HKT: F;
    readonly map: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fa: KindF<F, A>, f: (a: A) => B) => KindF<F, B>;
};
export declare type Functor1<F extends HKTS> = {
    readonly HKT: F;
    readonly map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>;
};
export declare type Functor2<F extends HKTS2> = {
    readonly HKT: F;
    readonly map: <E, A, B>(fa: Kind2<F, E, A>, f: (a: A) => B) => Kind2<F, E, B>;
};
export declare type PipeableFunctor<F> = {
    readonly map: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;
};
export declare type PipeableFunctorF1<F extends HKTSF> = {
    readonly map: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(f: (a: A) => B) => (fa: KindF<F, A>) => KindF<F, B>;
};
export declare type PipeableFunctor1<F extends HKTS> = {
    readonly map: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
};
export declare type PipeableFunctor2<F extends HKTS2> = {
    readonly map: <E, A, B>(f: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
};
//# sourceMappingURL=Functor.d.ts.map