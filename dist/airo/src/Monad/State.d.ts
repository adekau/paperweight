import { Monad2 } from './Monad';
declare module './HKT' {
    interface HKTToKind2<E, A> {
        State: State<E, A>;
    }
}
export declare const HKTId = "State";
export declare type HKTId = typeof HKTId;
export declare type State<S, A> = (s: S) => [A, S];
export declare const evalState: <S, A>(ma: State<S, A>, s: S) => A;
export declare const execState: <S, A>(ma: State<S, A>, s: S) => S;
export declare const get: <S>() => State<S, S>;
export declare const gets: <S, A>(f: (s: S) => A) => State<S, A>;
export declare const put: <S>(s: S) => State<S, void>;
export declare const modify: <S>(f: (s: S) => S) => State<S, void>;
export declare const State: Monad2<HKTId>;
export declare const StateP: import("./Functor").PipeableFunctor2<"State"> & {
    readonly ap: <E, A, B>(fa: State<E, A>) => (fab: State<E, (a: A) => B>) => State<E, B>;
    readonly apFirst: <E_1, B_1>(fb: State<E_1, B_1>) => <A_1>(fa: State<E_1, A_1>) => State<E_1, A_1>;
    readonly apSecond: <E_2, B_2>(fb: State<E_2, B_2>) => <A_2>(fa: State<E_2, A_2>) => State<E_2, B_2>;
} & {
    readonly bind: <E_3, A_3, B_3>(f: (a: A_3) => State<E_3, B_3>) => (fa: State<E_3, A_3>) => State<E_3, B_3>;
    readonly bindFirst: <E_4, A_4, B_4>(f: (a: A_4) => State<E_4, B_4>) => (fa: State<E_4, A_4>) => State<E_4, A_4>;
    readonly flatten: <E_5, A_5>(mma: State<E_5, State<E_5, A_5>>) => State<E_5, A_5>;
} & {
    readonly of: <E_6, A_6>() => (a: A_6) => State<E_6, A_6>;
};
