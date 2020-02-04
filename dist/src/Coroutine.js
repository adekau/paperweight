// import { Prod, snd, fst } from "./Prod";
// import { Sum, inl, inr } from "./Sum";
// import { Func, curry, apply, func, applyPair } from "./Func";
// import { One, identity } from "./Category";
// export type CoRef<TState, TErr, T> = {
//     get: Coroutine<TState, TErr, T>;
//     set: (_: T) => Coroutine<TState, TErr, One>;
// };
// // Coroutine Return
// export type CoRet<TState, T> = Prod<T, TState>;
// // Coroutine Continue
// export type CoCont<TState, TErr, T> = Prod<Coroutine<TState, TErr, T>, TState>;
// export type CoPreRes<TState, TErr, T> = Sum<TErr, CoRes<TState, TErr, T>>;
// // Coroutine result can be either a return or a continue
// export type CoRes<TState, TErr, T> = Sum<CoCont<TState, TErr, T>, CoRet<TState, T>>;
// export type CoFunc<TState, TErr, T> = Func<TState, CoPreRes<TState, TErr, T>>;
// export type Coroutine<TState, TErr, T> = {
//     run: CoFunc<TState, TErr, T>;
//     then: <U>(k: (_: T) => Coroutine<TState, TErr, U>) => Coroutine<TState, TErr, U>;
//     ignore: () => Coroutine<TState, TErr, One>;
//     ignoreWith: <U>(val: U) => Coroutine<TState, TErr, U>;
//     map: <U>(f: Func<T, U>) => Coroutine<TState, TErr, U>;
// };
// export function error<TState, TErr, T>(): Func<TErr, CoPreRes<TState, TErr, T>> {
//     return inl<TErr, CoRes<TState, TErr, T>>();
// };
// export function noError<TState, TErr, T>(): Func<CoRes<TState, TErr, T>, CoPreRes<TState, TErr, T>> {
//     return inr<TErr, CoRes<TState, TErr, T>>();
// };
// export function continuation<TState, TErr, T>(): Func<CoCont<TState, TErr, T>, CoRes<TState, TErr, T>> {
//     return inl<CoCont<TState, TErr, T>, CoRet<TState, T>>();
// };
// export function result<TState, TErr, T>(): Func<CoRet<TState, T>, CoRes<TState, TErr, T>> {
//     return inr<CoCont<TState, TErr, T>, CoRet<TState, T>>();
// };
// export function value<TState, T>(): Func<Prod<T, TState>, CoRet<TState, T>> {
//     return identity<CoRet<TState, T>>();
// };
// function createCoroutine<TState, TErr, T>(run: CoFunc<TState, TErr, T>): Coroutine<TState, TErr, T> {
//     return {
//         run,
//         then: function<U>(this: Coroutine<TState, TErr, T>, k: (_: T) => Coroutine<TState, TErr, U>): Coroutine<TState, TErr, U> {
//             const f = curry(snd<Coroutine<TState, TErr, T>, T>().then(func(k)));
//             const g = identity<Coroutine<TState, TErr, T>>().times(f);
//             const h = g.then(mapFunc()).then(joinFunc());
//             return apply(h, this);
//         } 
//     }
// };
// function mapFunc<TState, TErr, T, U>(): Func<Prod<Coroutine<TState, TErr, T>, Func<T, U>>, Coroutine<TState, TErr, U>> {
//     return func(p => p.fst.map(p.snd));
// };
// function joinFunc<TState, TErr, T>() {
//     return func<Coroutine<TState, TErr, Coroutine<TState, TErr, T>>, Coroutine<TState, TErr, T>>(p => coJoin<TState, TErr, T>(p));
// };
// export let coRun = function <TState, TErr, T>(): Func<Coroutine<TState, TErr, T>, CoFunc<TState, TErr, T>> {
//     return func(p => p.run);
// };
// function coJoin<TState, TErr, T>(p: Coroutine<TState, TErr, Coroutine<TState, TErr, T>>) {
//     let f: Func<CoPreRes<TState, TErr, Coroutine<TState, TErr, T>>, CoPreRes<TState, TErr, T>> = error<TState, TErr, T>().plus(
//         fst<Coroutine<TState, TErr, Coroutine<TState, TErr, T>>, TState>().then(joinFunc()).times(snd<Coroutine<TState, TErr, Coroutine<TState, TErr, T>>, TState>()).then(
//             continuation<TState, TErr, T>().then(
//                 noError<TState, TErr, T>())).plus(
//                     func<CoRet<TState, Coroutine<TState, TErr, T>>, CoPreRes<TState, TErr, T>>(prv => apply(
//                         prv.fst.run.then(
//                             error<TState, TErr, T>().plus(
//                                 noError<TState, TErr, T>().after(continuation<TState, TErr, T>()).plus(
//                                     noError<TState, TErr, T>().after(result<TState, TErr, T>())),
//                             )),
//                         prv.snd)
//                     ))
//     )
//     let g = apply(curry(coRun<TState, TErr, Coroutine<TState, TErr, T>>().timesMap(identity<TState>()).then(applyPair()).then(f)), p)
//     return createCoroutine<TState, TErr, T>(g)
// };
//# sourceMappingURL=Coroutine.js.map