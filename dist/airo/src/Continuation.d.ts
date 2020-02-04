/** some definitions:
 *  C[F] = continuation monad. F in this case is a function.
 *  lift/return: F -> C[F]
 *  flatten/join: C[F] -> F
 *  bind (flatMap): C[F] -> (F -> C[F2]) -> C[F2]
 *  map: C[F] -> (F -> F2) -> C[F2]
 */
/**
 * Continuation Monad
 * @param fn
 */
export declare class Cont<T extends unknown> {
    fn: (resolve: (result: T) => void) => unknown;
    constructor(fn: (resolve: (result: T) => void) => unknown);
    static of<T extends unknown = unknown>(val: T): Cont<T>;
    static id<T extends unknown = unknown>(): (result: T) => T;
    bind<R extends unknown = unknown>(f: (result: T) => Cont<R>): Cont<R>;
    run<U extends unknown = unknown>(f: (result: T) => U): U;
    map<R extends unknown = unknown>(f: (result: T) => R): Cont<R>;
}
