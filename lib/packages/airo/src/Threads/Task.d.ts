import { MonadF1 } from '../Monad/Monad';
import { IsAny } from './helpers';
declare module '../Monad/HKT' {
    interface HKTToKindF<A> {
        Task: Task<A>;
    }
}
declare const HKTId = "Task";
declare type HKTId = typeof HKTId;
export interface ITaskOptions<T extends (...args: any[]) => any> {
    /**
     * Task id, used for keeping track of tasks in a thread pool.
     */
    id: number;
    /**
     * Function to execute when `Task.run` is called.
     */
    func: T;
}
/**
 * A deferred computation that can be run asynchronously or in parallel on a thread.
 * @param opts The options to use on Task creation.
 */
export declare class Task<T extends (...args: any[]) => any> implements ITaskOptions<T> {
    private _promise;
    /**
     * Completes the task with a value.
     * @param value the value to complete the task with.
     */
    resolve: (value?: ReturnType<T> | PromiseLike<ReturnType<T>> | undefined) => void;
    /**
     * Fails the task with a reason.
     * @param reason an explanation of why the task failed.
     */
    reject: (reason?: unknown) => void;
    static taskCounter: number;
    id: number;
    func: T;
    state: 'todo' | 'running' | 'done' | 'error';
    startTime: Date | undefined;
    constructor(opts: ITaskOptions<T>);
    constructor(fn: T);
    /**
     * Gets the next available id for a new task. Automatically called using `TaskMonad.of`
     * @returns number
     */
    static getNextId(): number;
    /**
     * Runs the task.
     * @param args Arguments to run the task's function with.
     * @returns Promise<T>
     */
    run(...args: Parameters<T>): Promise<T>;
    /**
     * Maps from one function to another in a new Task.
     * @param f A function from the calling task's `func` type to a new `func` type.
     * @example TaskMonad.of((x: number) => x + 1).map(f => (x: number) => f(x) * 2)
     */
    map<B extends (..._: any[]) => any>(this: Task<T>, f: (a: T) => B): Task<B>;
    /**
     * If the task wraps a function that accepts a function as input and returns a new function, apply
     * takes a task from the domain function and returns a task that accepts input and returns the range function.
     * @param fa Task with a function on the left hand side of the first task.
     * @example
     * ```
     *  const f1 = (x: number) => x + 15;
     *  //                  v--domain               v--- range function
     *  const f = (domain: (x: number) => number): ((x: number) => string) =>
     *      (x: number) => f_1(x).toString();
     *  const task = TaskMonad.of(f);
     *  const task2 = task.ap(TaskMonad.of(f1));
     *  const result = await task2.run(6); // '21'
        ```
     */
    ap(this: Task<T>, fa: Task<Parameters<T>[0]>): Task<ReturnType<T>>;
    /**
     * Takes a function mapping the previous function to a new Task with a different function.
     * @param f Mapping function from thisTask.func -> new Task.
     * @example
     * ```
     * const f1 = (x: number) => x + 15;
     * const f2 = (x: number) => x.toString();
     * const task = TaskMonad.of(f1);
     * const task2 = task.bind(f => TaskMonad.of((x: number) => f2(f(x))));
     * const result = await task2.run(51)) // 66
     * ```
     */
    bind<B extends (..._: any[]) => any>(this: Task<T>, f: (a: T) => Task<B>): Task<B>;
    /**
     * Returns a promise that completes when the task is done, or fails when the task fails.
     * @returns Promise<ReturnType<T>>
     * @example
     * ```
     * const task = TaskMonad.of((x: string) => x.length);
     * Thread.run(task, 'hello');
     * const result = await task.done(); // 5
     * ```
     */
    done(): Promise<ReturnType<T>>;
}
/**
 * Contains the functions necessary for using `Task` as a monad.
 */
export declare const TaskMonad: MonadF1<HKTId>;
/**
 * Creates a function from a string. Used when you need async keyword in a task running on a non-main thread.
 * Necessary or else TypeScript will compile the await keyword to a promise using `__awaiter` and `__generator`
 * which are defined in TSLib which is unavailable in threads.
 * @warning Uses `eval` internally to convert string to function, don't expose this function to user input.
 * @example const fn: (x: any) => any = sfunc`(x) => x + 2`;
 */
export declare function sfunc<A = any, R = any>(literals: TemplateStringsArray, ...vars: string[]): IsAny<A> extends true ? (..._: any[]) => R : (a: A) => R;
export declare const ap: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fa: Task<A>) => (fab: Task<(a: A) => B>) => Task<B>, apFirst: <B extends (..._: any[]) => any>(fb: Task<B>) => <A extends (..._: any[]) => any>(fa: Task<A>) => Task<A>, apSecond: <B extends (..._: any[]) => any>(fb: Task<B>) => <A extends (..._: any[]) => any>(fa: Task<A>) => Task<B>, bind: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(f: (a: A) => Task<B>) => (fa: Task<A>) => Task<B>, bindFirst: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(f: (a: A) => Task<B>) => (fa: Task<A>) => Task<A>, flatten: <A extends (..._: any[]) => any>(mma: Task<A>) => Task<A>, map: <A extends (..._: any[]) => any, B extends (..._: any[]) => any>(f: (a: A) => B) => (fa: Task<A>) => Task<B>, of: <A extends (..._: any[]) => any>() => (a: A) => Task<A>;
export {};
//# sourceMappingURL=Task.d.ts.map