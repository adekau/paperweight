import { AnyFunc } from './Function';
import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';
import { Monad, Monad1, Monad2, MonadF1 } from './Monad';
import { State } from './State';

export type StateT<M, S, A> = {
    (s: S): HKT<M, [A, S]>;
};

export type StateTF1<M extends HKTSF, S extends AnyFunc, A extends AnyFunc> = {
    (s: S): KindF<M, () => [A, S]>;
};

export type StateT1<M extends HKTS, S, A> = {
    (s: S): Kind<M, [A, S]>;
};

export type StateT2<M extends HKTS2, S, E, A> = {
    (s: S): Kind2<M, E, [A, S]>;
};

export type StateM<M> = {
    readonly of: <S, A>(a: A) => StateT<M, S, A>;
    readonly map: <S, A, B>(ma: StateT<M, S, A>, f: (a: A) => B) => StateT<M, S, B>;
    readonly ap: <S, A, B>(mab: StateT<M, S, (a: A) => B>, ma: StateT<M, S, A>) => StateT<M, S, B>;
    readonly bind: <S, A, B>(ma: StateT<M, S, A>, f: (a: A) => StateT<M, S, B>) => StateT<M, S, B>;
    readonly get: <S>() => StateT<M, S, S>;
    readonly gets: <S, A>(f: (s: S) => A) => StateT<M, S, A>;
    readonly put: <S>(s: S) => StateT<M, S, void>;
    readonly modify: <S>(f: (s: S) => S) => StateT<M, S, void>;
    readonly fromState: <S, A>(fa: State<S, A>) => StateT<M, S, A>;
    readonly fromM: <S, A>(ma: HKT<M, A>) => StateT<M, S, A>;
    readonly evalState: <S, A>(ma: StateT<M, S, A>, s: S) => HKT<M, A>;
    readonly execState: <S, A>(ma: StateT<M, S, A>, s: S) => HKT<M, S>;
};

export type StateMF1<M extends HKTSF> = {
    readonly of: <S extends AnyFunc, A extends AnyFunc>(a: A) => StateTF1<M, S, A>;
    readonly map: <S extends AnyFunc, A extends AnyFunc, B extends AnyFunc>(ma: StateTF1<M, S, A>, f: (a: A) => B) => StateTF1<M, S, B>;
    readonly ap: <S extends AnyFunc, A extends AnyFunc, B extends AnyFunc>(mab: StateTF1<M, S, (a: A) => B>, ma: StateTF1<M, S, A>) => StateTF1<M, S, B>;
    readonly bind: <S extends AnyFunc, A extends AnyFunc, B extends AnyFunc>(ma: StateTF1<M, S, A>, f: (a: A) => StateTF1<M, S, B>) => StateTF1<M, S, B>;
    readonly get: <S extends AnyFunc>() => StateTF1<M, S, S>;
    readonly gets: <S extends AnyFunc, A extends AnyFunc>(f: (s: S) => A) => StateTF1<M, S, A>;
    readonly put: <S extends AnyFunc>(s: S) => StateTF1<M, S, () => void>;
    readonly modify: <S extends AnyFunc>(f: (s: S) => S) => StateTF1<M, S, () => void>;
    readonly fromState: <S extends AnyFunc, A extends AnyFunc>(fa: State<S, A>) => StateTF1<M, S, A>;
    readonly fromM: <S extends AnyFunc, A extends AnyFunc>(ma: KindF<M, A>) => StateTF1<M, S, A>;
    readonly evalState: <S extends AnyFunc, A extends AnyFunc>(ma: StateTF1<M, S, A>, s: S) => KindF<M, A>;
    readonly execState: <S extends AnyFunc, A extends AnyFunc>(ma: StateTF1<M, S, A>, s: S) => KindF<M, S>;
};

export type StateM1<M extends HKTS> = {
    readonly of: <S, A>(a: A) => StateT1<M, S, A>;
    readonly map: <S, A, B>(ma: StateT1<M, S, A>, f: (a: A) => B) => StateT1<M, S, B>;
    readonly ap: <S, A, B>(mab: StateT1<M, S, (a: A) => B>, ma: StateT1<M, S, A>) => StateT1<M, S, B>;
    readonly bind: <S, A, B>(ma: StateT1<M, S, A>, f: (a: A) => StateT1<M, S, B>) => StateT1<M, S, B>;
    readonly get: <S>() => StateT1<M, S, S>;
    readonly gets: <S, A>(f: (s: S) => A) => StateT1<M, S, A>;
    readonly put: <S>(s: S) => StateT1<M, S, void>;
    readonly modify: <S>(f: (s: S) => S) => StateT1<M, S, void>;
    readonly fromState: <S, A>(fa: State<S, A>) => StateT1<M, S, A>;
    readonly fromM: <S, A>(ma: Kind<M, A>) => StateT1<M, S, A>;
    readonly evalState: <S, A>(ma: StateT1<M, S, A>, s: S) => Kind<M, A>;
    readonly execState: <S, A>(ma: StateT1<M, S, A>, s: S) => Kind<M, S>;
};

export type StateM2<M extends HKTS2> = {
    readonly of: <S, E, A>(a: A) => StateT2<M, S, E, A>;
    readonly map: <S, E, A, B>(ma: StateT2<M, S, E, A>, f: (a: A) => B) => StateT2<M, S, E, B>;
    readonly ap: <S, E, A, B>(mab: StateT2<M, S, E, (a: A) => B>, ma: StateT2<M, S, E, A>) => StateT2<M, S, E, B>;
    readonly bind: <S, E, A, B>(ma: StateT2<M, S, E, A>, f: (a: A) => StateT2<M, S, E, B>) => StateT2<M, S, E, B>;
    readonly get: <E, S>() => StateT2<M, S, E, S>;
    readonly gets: <S, E, A>(f: (s: S) => A) => StateT2<M, S, E, A>;
    readonly put: <E, S>(s: S) => StateT2<M, S, E, void>;
    readonly modify: <E, S>(f: (s: S) => S) => StateT2<M, S, E, void>;
    readonly fromState: <S, E, A>(fa: State<S, A>) => StateT2<M, S, E, A>;
    readonly fromM: <S, E, A>(ma: Kind2<M, E, A>) => StateT2<M, S, E, A>;
    readonly evalState: <S, E, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, A>;
    readonly execState: <S, E, A>(ma: StateT2<M, S, E, A>, s: S) => Kind2<M, E, S>;
};

export function getStateM<M extends HKTS2>(M: Monad2<M>): StateM2<M>
export function getStateM<M extends HKTSF>(M: MonadF1<M>): StateMF1<M>
export function getStateM<M extends HKTS>(M: Monad1<M>): StateM1<M>
export function getStateM<M>(M: Monad<M>): StateM<M> {
    return {
        of: a => s => M.of([a, s]),
        map: (ma, f) => s => M.map(ma(s), ([a, s1]) => [f(a), s1]),
        ap: (mab, ma) => s => M.bind(mab(s), ([f, s]) => M.map(ma(s), ([a, s]) => [f(a), s])),
        bind: (ma, f) => s => M.bind(ma(s), ([a, s1]) => f(a)(s1)),
        get: () => s => M.of([s, s]),
        gets: f => s => M.of([f(s), s]),
        put: s => () => M.of([undefined, s]),
        modify: f => s => M.of([undefined, f(s)]),
        fromState: sa => s => M.of(sa(s)),
        fromM: ma => s => M.map(ma, a => [a, s]),
        evalState: (ma, s) => M.map(ma(s), ([a]) => a),
        execState: (ma, s) => M.map(ma(s), ([_, s]) => s)
    };
};
