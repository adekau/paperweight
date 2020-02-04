import { Applicative, Applicative1, Applicative2, ApplicativeF1, PipeableApplicative, PipeableApplicative1, PipeableApplicative2, PipeableApplicativeF1 } from './Applicative';
import { Apply, Apply1, Apply2, ApplyF1, PipeableApply, PipeableApply1, PipeableApply2, PipeableApplyF1 } from './Apply';
import { Bindable, Bindable1, Bindable2, BindableF1, PipeableBindable, PipeableBindable1, PipeableBindable2, PipeableBindableF1 } from './Bindable';
import { Functor, Functor1, Functor2, FunctorF1, PipeableFunctor, PipeableFunctor1, PipeableFunctor2, PipeableFunctorF1 } from './Functor';
import { HKTS, HKTS2, HKTSF } from './HKT';
export declare function pipe<T1>(v: T1): T1;
export declare function pipe<T1, T2>(v: T1, fn1: (t1: T1) => T2): T2;
export declare function pipe<T1, T2, T3>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3): T3;
export declare function pipe<T1, T2, T3, T4>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4): T4;
export declare function pipe<T1, T2, T3, T4>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4): T4;
export declare function pipe<T1, T2, T3, T4, T5>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5): T5;
export declare function pipe<T1, T2, T3, T4, T5, T6>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6): T6;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7): T7;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8): T8;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8, fn8: (t8: T8) => T9): T9;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8, fn8: (t8: T8) => T9, fn9: (t9: T9) => T10): (t1: T1) => T10;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8, fn8: (t8: T8) => T9, fn9: (t9: T9) => T10, fn10: (t10: T10) => T11): T11;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8, fn8: (t8: T8) => T9, fn9: (t9: T9) => T10, fn10: (t10: T10) => T11, fn11: (t11: T11) => T12): T12;
export declare function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4, fn4: (t4: T4) => T5, fn5: (t5: T5) => T6, fn6: (t6: T6) => T7, fn7: (t7: T7) => T8, fn8: (t8: T8) => T9, fn9: (t9: T9) => T10, fn10: (t10: T10) => T11, fn11: (t11: T11) => T12, fn12: (t12: T12) => T13): T13;
export declare function pipeable<F extends HKTS2, I>(I: {
    HKT: F;
} & I): (I extends Bindable2<F> ? PipeableBindable2<F> : I extends Apply2<F> ? PipeableApply2<F> : I extends Functor2<F> ? PipeableFunctor2<F> : {}) & (I extends Applicative2<F> ? PipeableApplicative2<F> : {});
export declare function pipeable<F extends HKTS, I>(I: {
    HKT: F;
} & I): (I extends Bindable1<F> ? PipeableBindable1<F> : I extends Apply1<F> ? PipeableApply1<F> : I extends Functor1<F> ? PipeableFunctor1<F> : {}) & (I extends Applicative1<F> ? PipeableApplicative1<F> : {});
export declare function pipeable<F extends HKTSF, I>(I: {
    HKT: F;
} & I): (I extends BindableF1<F> ? PipeableBindableF1<F> : I extends ApplyF1<F> ? PipeableApplyF1<F> : I extends FunctorF1<F> ? PipeableFunctorF1<F> : {}) & (I extends ApplicativeF1<F> ? PipeableApplicativeF1<F> : {});
export declare function pipeable<F, I>(I: {
    HKT: F;
} & I): (I extends Bindable<F> ? PipeableBindable<F> : I extends Apply<F> ? PipeableApply<F> : I extends Functor<F> ? PipeableFunctor<F> : {}) & (I extends Applicative<F> ? PipeableApplicative<F> : {});
