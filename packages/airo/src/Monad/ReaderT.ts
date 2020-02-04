import { AnyFunc } from './Function';
import { HKT, HKTS, HKTS2, HKTSF, Kind, Kind2, KindF } from './HKT';
import { Monad, Monad1, Monad2, MonadF1 } from './Monad';
import { Reader } from './Reader';

export type ReaderT<M, R, A> = {
    (r: R): HKT<M, A>
};

export type ReaderM<M> = {
    readonly map: <R, A, B>(ma: ReaderT<M, R, A>, f: (a: A) => B) => ReaderT<M, R, B>;
    readonly of: <R, A>(a: A) => ReaderT<M, R, A>;
    readonly ap: <R, A, B>(mab: ReaderT<M, R, (a: A) => B>, ma: ReaderT<M, R, A>) => ReaderT<M, R, B>;
    readonly bind: <R, A, B>(ma: ReaderT<M, R, A>, f: (a: A) => ReaderT<M, R, B>) => ReaderT<M, R, B>;
    readonly ask: <R>() => ReaderT<M, R, R>;
    readonly asks: <R, A>(f: (r: R) => A) => ReaderT<M, R, A>;
    readonly local: <R, A, Q>(ma: ReaderT<M, R, A>, f: (d: Q) => R) => ReaderT<M, Q, A>;
    readonly fromReader: <R, A>(ma: Reader<R, A>) => ReaderT<M, R, A>;
    readonly fromM: <R, A>(ma: HKT<M, A>) => ReaderT<M, R, A>;
};

export type ReaderTF1<M extends HKTSF, R, A extends AnyFunc> = {
    (r: R): KindF<M, A>;
};

export type ReaderMF1<M extends HKTSF> = {
    readonly map: <R, A extends AnyFunc, B extends AnyFunc>(ma: ReaderT<M, R, A>, f: (a: A) => B) => ReaderT<M, R, B>;
    readonly of: <R, A extends AnyFunc>(a: A) => ReaderT<M, R, A>;
    readonly ap: <R, A extends AnyFunc, B extends AnyFunc>(mab: ReaderT<M, R, (a: A) => B>, ma: ReaderT<M, R, A>) => ReaderT<M, R, B>;
    readonly bind: <R, A extends AnyFunc, B extends AnyFunc>(ma: ReaderT<M, R, A>, f: (a: A) => ReaderT<M, R, B>) => ReaderT<M, R, B>;
    readonly ask: <R>() => ReaderT<M, R, R>;
    readonly asks: <R, A extends AnyFunc>(f: (r: R) => A) => ReaderT<M, R, A>;
    readonly local: <R, A extends AnyFunc, Q>(ma: ReaderT<M, R, A>, f: (d: Q) => R) => ReaderT<M, Q, A>;
    readonly fromReader: <R, A extends AnyFunc>(ma: Reader<R, A>) => ReaderT<M, R, A>;
    readonly fromM: <R, A extends AnyFunc>(ma: KindF<M, A>) => ReaderT<M, R, A>;
};


export type ReaderT1<M extends HKTS, R, A> = {
    (r: R): Kind<M, A>;
};

export type ReaderM1<M extends HKTS> = {
    readonly map: <R, A, B>(ma: ReaderT1<M, R, A>, f: (a: A) => B) => ReaderT1<M, R, B>;
    readonly of: <R, A>(a: A) => ReaderT1<M, R, A>;
    readonly ap: <R, A, B>(mab: ReaderT1<M, R, (a: A) => B>, ma: ReaderT1<M, R, A>) => ReaderT1<M, R, B>;
    readonly bind: <R, A, B>(ma: ReaderT1<M, R, A>, f: (a: A) => ReaderT1<M, R, B>) => ReaderT1<M, R, B>;
    readonly ask: <R>() => ReaderT1<M, R, R>;
    readonly asks: <R, A>(f: (r: R) => A) => ReaderT1<M, R, A>;
    readonly local: <R, A, Q>(ma: ReaderT1<M, R, A>, f: (d: Q) => R) => ReaderT1<M, Q, A>;
    readonly fromReader: <R, A>(ma: Reader<R, A>) => ReaderT1<M, R, A>;
    readonly fromM: <R, A>(ma: Kind<M, A>) => ReaderT1<M, R, A>;
};

export type ReaderT2<M extends HKTS2, R, E, A> = {
    (r: R): Kind2<M, E, A>;
};

export type ReaderM2<M extends HKTS2> = {
    readonly map: <R, E, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => B) => ReaderT2<M, R, E, B>;
    readonly of: <R, E, A>(a: A) => ReaderT2<M, R, E, A>;
    readonly ap: <R, E, A, B>(mab: ReaderT2<M, R, E, (a: A) => B>, ma: ReaderT2<M, R, E, A>) => ReaderT2<M, R, E, B>;
    readonly bind: <R, E, A, B>(ma: ReaderT2<M, R, E, A>, f: (a: A) => ReaderT2<M, R, E, B>) => ReaderT2<M, R, E, B>;
    readonly ask: <R, E>() => ReaderT2<M, R, E, R>;
    readonly asks: <R, E, A>(f: (r: R) => A) => ReaderT2<M, R, E, A>;
    readonly local: <R, E, A, Q>(ma: ReaderT2<M, R, E, A>, f: (d: Q) => R) => ReaderT2<M, Q, E, A>;
    readonly fromReader: <R, E, A>(ma: Reader<R, A>) => ReaderT2<M, R, E, A>;
    readonly fromM: <R, E, A>(ma: Kind2<M, E, A>) => ReaderT2<M, R, E, A>;
};

export function getReaderM<M extends HKTS2>(m: Monad2<M>): ReaderM2<M>;
export function getReaderM<M extends HKTSF>(m: MonadF1<M>): ReaderMF1<M>;
export function getReaderM<M extends HKTS>(m: Monad1<M>): ReaderM1<M>;
export function getReaderM<M>(m: Monad<M>): ReaderM<M> {
    return {
        map: (ma, f) => r => m.map(ma(r), f),
        of: (a) => () => m.of(a),
        ap: (mab, ma) => r => m.ap(mab(r), ma(r)),
        bind: (ma, f) => r => m.bind(ma(r), a => f(a)(r)),
        ask: () => m.of,
        asks: f => r => m.map(m.of(r), f),
        local: (ma, f) => q => ma(f(q)),
        fromReader: ma => r => m.of(ma(r)),
        fromM: ma => () => ma
    };
};
