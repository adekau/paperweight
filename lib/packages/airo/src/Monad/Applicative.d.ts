import { Apply, Apply1, Apply2, ApplyF1, PipeableApply, PipeableApply1, PipeableApply2, PipeableApplyF1 } from './Apply';
import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';
export declare type Applicative<F> = Apply<F> & {
    readonly of: <A>(a: A) => HKT<F, A>;
};
export declare type ApplicativeF1<F extends HKTSF> = ApplyF1<F> & {
    readonly of: <A extends (..._: any[]) => any>(a: A) => KindF<F, A>;
};
export declare type Applicative1<F extends HKTS> = Apply1<F> & {
    readonly of: <A>(a: A) => Kind<F, A>;
};
export declare type Applicative2<F extends HKTS2> = Apply2<F> & {
    readonly of: <E, A>(a: A) => Kind2<F, E, A>;
};
export declare type PipeableApplicative<F> = PipeableApply<F> & {
    readonly of: <A>() => (a: A) => HKT<F, A>;
};
export declare type PipeableApplicativeF1<F extends HKTSF> = PipeableApplyF1<F> & {
    readonly of: <A extends (..._: any[]) => any>() => (a: A) => KindF<F, A>;
};
export declare type PipeableApplicative1<F extends HKTS> = PipeableApply1<F> & {
    readonly of: <A>() => (a: A) => Kind<F, A>;
};
export declare type PipeableApplicative2<F extends HKTS2> = PipeableApply2<F> & {
    readonly of: <E, A>() => (a: A) => Kind2<F, E, A>;
};
//# sourceMappingURL=Applicative.d.ts.map