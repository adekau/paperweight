import { Apply, Apply1, Apply2, ApplyF1, PipeableApply, PipeableApply1, PipeableApply2, PipeableApplyF1 } from './Apply';
import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';

export type Applicative<F> = Apply<F> & {
    readonly of: <A>(a: A) => HKT<F, A>;
};

export type ApplicativeF1<F extends HKTSF> = ApplyF1<F> & {
    readonly of: <A extends (..._: any[]) => any>(a: A) => KindF<F, A>;
};

export type Applicative1<F extends HKTS> = Apply1<F> & {
    readonly of: <A>(a: A) => Kind<F, A>;
};

export type Applicative2<F extends HKTS2> = Apply2<F> & {
    readonly of: <E, A>(a: A) => Kind2<F, E, A>
};

export type PipeableApplicative<F> = PipeableApply<F> & {
    readonly of: <A>() => (a: A) => HKT<F, A>;
};

export type PipeableApplicativeF1<F extends HKTSF> = PipeableApplyF1<F> & {
    readonly of: <A extends (..._: any[]) => any>() => (a: A) => KindF<F, A>;
};

export type PipeableApplicative1<F extends HKTS> = PipeableApply1<F> & {
    readonly of: <A>() => (a: A) => Kind<F, A>;
};

export type PipeableApplicative2<F extends HKTS2> = PipeableApply2<F> & {
    readonly of: <E, A>() => (a: A) => Kind2<F, E, A>;
};
