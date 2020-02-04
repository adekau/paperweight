import { Functor, Functor1, Functor2, FunctorF1, PipeableFunctor, PipeableFunctor1, PipeableFunctor2, PipeableFunctorF1 } from './Functor';
import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';
export declare type Apply<F> = Functor<F> & {
    readonly ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>;
};
export declare type ApplyF1<F extends HKTSF> = FunctorF1<F> & {
    readonly ap: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fab: KindF<F, (a: A) => B>, fa: KindF<F, A>) => KindF<F, B>;
};
export declare type Apply1<F extends HKTS> = Functor1<F> & {
    readonly ap: <A, B>(fab: Kind<F, (a: A) => B>, fa: Kind<F, A>) => Kind<F, B>;
};
export declare type Apply2<F extends HKTS2> = Functor2<F> & {
    readonly ap: <E, A, B>(fab: Kind2<F, E, (a: A) => B>, fa: Kind2<F, E, A>) => Kind2<F, E, B>;
};
export declare type PipeableApply<F> = PipeableFunctor<F> & {
    readonly ap: <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B>;
    readonly apFirst: <B>(fb: HKT<F, B>) => <A>(fa: HKT<F, A>) => HKT<F, A>;
    readonly apSecond: <B>(fb: HKT<F, B>) => <A>(fa: HKT<F, A>) => HKT<F, B>;
};
export declare type PipeableApplyF1<F extends HKTSF> = PipeableFunctorF1<F> & {
    readonly ap: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fa: KindF<F, A>) => (fab: KindF<F, (a: A) => B>) => KindF<F, B>;
    readonly apFirst: <B extends (..._: any[]) => any>(fb: KindF<F, B>) => <A extends (..._: any[]) => any>(fa: KindF<F, A>) => KindF<F, A>;
    readonly apSecond: <B extends (..._: any[]) => any>(fb: KindF<F, B>) => <A extends (..._: any[]) => any>(fa: KindF<F, A>) => KindF<F, B>;
};
export declare type PipeableApply1<F extends HKTS> = PipeableFunctor1<F> & {
    readonly ap: <A, B>(fa: Kind<F, A>) => (fab: Kind<F, (a: A) => B>) => Kind<F, B>;
    readonly apFirst: <B>(fb: Kind<F, B>) => <A>(fa: Kind<F, A>) => Kind<F, A>;
    readonly apSecond: <B>(fb: Kind<F, B>) => <A>(fa: Kind<F, A>) => Kind<F, B>;
};
export declare type PipeableApply2<F extends HKTS2> = PipeableFunctor2<F> & {
    readonly ap: <E, A, B>(fa: Kind2<F, E, A>) => (fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>;
    readonly apFirst: <E, B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, A>;
    readonly apSecond: <E, B>(fb: Kind2<F, E, B>) => <A>(fa: Kind2<F, E, A>) => Kind2<F, E, B>;
};
//# sourceMappingURL=Apply.d.ts.map