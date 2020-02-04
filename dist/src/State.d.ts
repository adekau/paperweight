import { One } from './Category';
import { Func } from './Func';
import { Prod } from './Prod';
export declare type StFunc<TState, T> = Func<TState, Prod<T, TState>>;
export declare type State<TState, T> = {
    run: StFunc<TState, T>;
    then: <U>(state: (curr: T) => State<TState, U>) => State<TState, U>;
    ignore: () => State<TState, One>;
    ignoreWith: <U>(val: U) => State<TState, U>;
    map: <U>(mapFunc: Func<T, U>) => State<TState, U>;
};
export declare function createState<TState, T>(runFunc: StFunc<TState, T>): State<TState, T>;
export declare function stRun<TState, T>(): Func<State<TState, T>, StFunc<TState, T>>;
export declare function stJoin<TState, T>(f: State<TState, State<TState, T>>): State<TState, T>;
