import {
    Applicative,
    Applicative1,
    Applicative2,
    ApplicativeF1,
    PipeableApplicative,
    PipeableApplicative1,
    PipeableApplicative2,
    PipeableApplicativeF1,
} from './Applicative';
import { Apply, Apply1, Apply2, ApplyF1, PipeableApply, PipeableApply1, PipeableApply2, PipeableApplyF1 } from './Apply';
import {
    Bindable,
    Bindable1,
    Bindable2,
    BindableF1,
    PipeableBindable,
    PipeableBindable1,
    PipeableBindable2,
    PipeableBindableF1,
} from './Bindable';
import {
    Functor,
    Functor1,
    Functor2,
    FunctorF1,
    PipeableFunctor,
    PipeableFunctor1,
    PipeableFunctor2,
    PipeableFunctorF1,
} from './Functor';
import { HKT, HKTS, HKTS2, HKTSF } from './HKT';

export function pipe<T1>(v: T1): T1;
export function pipe<T1, T2>(v: T1, fn1: (t1: T1) => T2): T2;
export function pipe<T1, T2, T3>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3): T3;
export function pipe<T1, T2, T3, T4>(v: T1, fn1: (t1: T1) => T2, fn2: (t2: T2) => T3, fn3: (t3: T3) => T4): T4;
export function pipe<T1, T2, T3, T4>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4
): T4;
export function pipe<T1, T2, T3, T4, T5>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5
): T5;
export function pipe<T1, T2, T3, T4, T5, T6>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6
): T6;
export function pipe<T1, T2, T3, T4, T5, T6, T7>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7
): T7;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8
): T8;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8,
    fn8: (t8: T8) => T9
): T9;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8,
    fn8: (t8: T8) => T9,
    fn9: (t9: T9) => T10
): (t1: T1) => T10;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8,
    fn8: (t8: T8) => T9,
    fn9: (t9: T9) => T10,
    fn10: (t10: T10) => T11
): T11;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8,
    fn8: (t8: T8) => T9,
    fn9: (t9: T9) => T10,
    fn10: (t10: T10) => T11,
    fn11: (t11: T11) => T12
): T12
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
    v: T1,
    fn1: (t1: T1) => T2,
    fn2: (t2: T2) => T3,
    fn3: (t3: T3) => T4,
    fn4: (t4: T4) => T5,
    fn5: (t5: T5) => T6,
    fn6: (t6: T6) => T7,
    fn7: (t7: T7) => T8,
    fn8: (t8: T8) => T9,
    fn9: (t9: T9) => T10,
    fn10: (t10: T10) => T11,
    fn11: (t11: T11) => T12,
    fn12: (t12: T12) => T13
): T13
export function pipe(
    v: any,
    ...fns: Function[]
): any {
    if (!fns.length)
        throw Error('Unexpected number of arguments passed to `pipe`.');
    return fns.reduce((acc, curFn) => curFn(acc), v);
}

const isFunctor = <F>(x: unknown): x is Functor<F> =>
    Object.prototype.hasOwnProperty.call(x, 'map')
    && typeof (x as any).map === 'function';

const isApply = <F>(x: unknown): x is Apply<F> =>
    Object.prototype.hasOwnProperty.call(x, 'ap')
    && typeof (x as any).ap === 'function';

const isBindable = <F>(x: unknown): x is Bindable<F> =>
    Object.prototype.hasOwnProperty.call(x, 'bind')
    && typeof (x as any).bind === 'function';

const isApplicative = <F>(x: unknown): x is Applicative<F> =>
    Object.prototype.hasOwnProperty.call(x, 'of')
    && typeof (x as any).of === 'function';

export function pipeable<F extends HKTS2, I>(
    I: { HKT: F } & I
): (
    I extends Bindable2<F> ? PipeableBindable2<F> :
    I extends Apply2<F> ? PipeableApply2<F> :
    I extends Functor2<F> ? PipeableFunctor2<F> :
    {}
) & (
        I extends Applicative2<F> ? PipeableApplicative2<F> :
        {}
    );
export function pipeable<F extends HKTS, I>(
    I: { HKT: F } & I
): (
    I extends Bindable1<F> ? PipeableBindable1<F> :
    I extends Apply1<F> ? PipeableApply1<F> :
    I extends Functor1<F> ? PipeableFunctor1<F> :
    {}
) & (
        I extends Applicative1<F> ? PipeableApplicative1<F> :
        {}
    );
export function pipeable<F extends HKTSF, I>(
    I: { HKT: F } & I
): (
    I extends BindableF1<F> ? PipeableBindableF1<F> :
    I extends ApplyF1<F> ? PipeableApplyF1<F> :
    I extends FunctorF1<F> ? PipeableFunctorF1<F> :
    {}
) & (
        I extends ApplicativeF1<F> ? PipeableApplicativeF1<F> :
        {}
    );
export function pipeable<F, I>(
    I: { HKT: F } & I
): (
    I extends Bindable<F> ? PipeableBindable<F> :
    I extends Apply<F> ? PipeableApply<F> :
    I extends Functor<F> ? PipeableFunctor<F> :
    {}
) & (
        I extends Applicative<F> ? PipeableApplicative<F> :
        {}
    );
export function pipeable<F, I>(
    I: { HKT: F } & I
): any {
    const r: any = {};
    if (isFunctor<F>(I)) {
        const map: PipeableFunctor<F>['map'] = f => fa =>
            I.map(fa, f);
        r.map = map;
    }

    if (isApply<F>(I)) {
        const ap: PipeableApply<F>['ap'] = fa => fab =>
            I.ap(fab, fa);

        const apFirst: PipeableApply<F>['apFirst'] = fb => fa =>
            I.ap(I.map(fa, a => () => a), fb);

        const apSecond: PipeableApply<F>['apSecond'] = <B>(fb: HKT<F, B>) => fa =>
            I.ap(I.map(fa, () => (b: B) => b), fb);

        r.ap = ap;
        r.apFirst = apFirst;
        r.apSecond = apSecond;
    }

    if (isBindable<F>(I)) {
        const bind: PipeableBindable<F>['bind'] = f => fa =>
            I.bind(fa, f);

        const bindFirst: PipeableBindable<F>['bindFirst'] = f => fa =>
            I.bind(fa, a => I.map(f(a), () => a));

        const flatten: PipeableBindable<F>['flatten'] = mma =>
            I.bind(mma, a => a);

        r.bind = bind;
        r.bindFirst = bindFirst;
        r.flatten = flatten;
    }

    if (isApplicative<F>(I)) {
        const of: PipeableApplicative<F>['of'] = () => a =>
            I.of(a);

        r.of = of;
    }

    return r;
}
