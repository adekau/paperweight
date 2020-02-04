import { MonadF1 } from '../Monad/Monad';
import { pipeable } from '../Monad/Pipeable';
import { IsAny } from './helpers';

declare module '../Monad/HKT' {
    interface HKTToKindF<A> {
        Task: Task<A>
    }
};

const HKTId = 'Task';
type HKTId = typeof HKTId;

export interface ITaskOptions<T extends (...args: any[]) => any> {
    /**
     * Task id, used for keeping track of tasks in a thread pool.
     */
    id: number;

    /**
     * Function to execute when `Task.run` is called.
     */
    func: T;
};

/**
 * A deferred computation that can be run asynchronously or in parallel on a thread.
 * @param opts The options to use on Task creation.
 */
export class Task<T extends (...args: any[]) => any> implements ITaskOptions<T> {
    private _promise: Promise<ReturnType<T>>;
    /**
     * Completes the task with a value.
     * @param value the value to complete the task with.
     */
    public resolve: (value?: ReturnType<T> | PromiseLike<ReturnType<T>> | undefined) => void;
    /**
     * Fails the task with a reason.
     * @param reason an explanation of why the task failed.
     */
    public reject: (reason?: unknown) => void;
    public static taskCounter: number = 0;
    public id: number;
    public func: T;
    public state: 'todo' | 'running' | 'done' | 'error';
    public startTime: Date | undefined;

    constructor(opts: ITaskOptions<T>);
    constructor(fn: T);
    constructor(arg: any) {
        this.id = arg.id ?? Task.getNextId();
        this.func = arg.func ?? arg;
        this._promise = new Promise((resolve, reject) => {
            this.resolve = (value?: ReturnType<T> | PromiseLike<ReturnType<T>> | undefined) => {
                this.state = 'done';
                resolve(value);
            };

            this.reject = (reason?: unknown) => {
                this.state = 'error';
                reject(reason);
            };
        });
        this.state = 'todo';
        this.startTime = undefined;
    }

    /**
     * Gets the next available id for a new task. Automatically called using `TaskMonad.of`
     * @returns number
     */
    public static getNextId(): number {
        return ++Task.taskCounter;
    }

    /**
     * Runs the task.
     * @param args Arguments to run the task's function with.
     * @returns Promise<T>
     */
    public run(...args: Parameters<T>): Promise<T> {
        this.state = 'running';
        this.startTime = new Date();

        try {
            const result = this.func(...args);
            this.state = 'done';
            this.resolve(result);
        } catch (e) {
            this.state = 'error';
            this.reject(e);
        }

        return this.done();
    }

    /**
     * Maps from one function to another in a new Task.
     * @param f A function from the calling task's `func` type to a new `func` type.
     * @example TaskMonad.of((x: number) => x + 1).map(f => (x: number) => f(x) * 2)
     */
    map<B extends (..._: any[]) => any>(
        this: Task<T>,
        f: (a: T) => B
    ): Task<B> {
        return TaskMonad.map(this, f);
    }

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
    ap(this: Task<T>, fa: Task<Parameters<T>[0]>): Task<ReturnType<T>> {
        return TaskMonad.ap(this, fa);
    }

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
    bind<B extends (..._: any[]) => any>(this: Task<T>, f: (a: T) => Task<B>): Task<B> {
        return TaskMonad.bind(this, f);
    }

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
    public async done(): Promise<ReturnType<T>> {
        return this._promise
            .then((v: ReturnType<T>) => (this.state = 'done', v))
            .catch((e: any) => {
                this.state = 'error';
                throw e;
            });
    }
};

/**
 * Contains the functions necessary for using `Task` as a monad.
 */
export const TaskMonad: MonadF1<HKTId> = {
    HKT: HKTId,

    map<A extends (..._: any[]) => any, B extends (..._: any[]) => any>(
        fa: Task<A>,
        f: (a: A) => B
    ): Task<B> {
        return new Task({
            id: fa.id,
            func: f(fa.func)
        });
    },

    ap<A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fab: Task<(a: A) => B>, fa: Task<A>): Task<B> {
        return new Task({
            id: Task.getNextId(),
            func: fab.func(fa.func)
        });
    },

    /**
     * Creates a new Task with an auto generated id.
     * @param a Function to create the task with.
     */
    of<A extends (..._: any[]) => any>(a: A): Task<A> {
        return new Task({
            id: Task.getNextId(),
            func: a
        });
    },

    bind<A extends (..._: any[]) => any, B extends (..._: any[]) => any>(fa: Task<A>, f: (a: A) => Task<B>): Task<B> {
        return f(fa.func);
    }
}

/**
 * Creates a function from a string. Used when you need async keyword in a task running on a non-main thread.
 * Necessary or else TypeScript will compile the await keyword to a promise using `__awaiter` and `__generator`
 * which are defined in TSLib which is unavailable in threads.
 * @warning Uses `eval` internally to convert string to function, don't expose this function to user input.
 * @example const fn: (x: any) => any = sfunc`(x) => x + 2`;
 */
export function sfunc<A = any, R = any>(
    literals: TemplateStringsArray,
    ...vars: string[]
): IsAny<A> extends true
    ? (..._: any[]) => R
    : (a: A) => R
{
    let str: string = "";

    if (vars.length) {
        for (let i = 0; i < vars.length; i++) {
            str += literals[i] + vars[i];
        }
    }
    str += literals[literals.length - 1];

    return eval(`(${str})`);
}

export const TaskP = pipeable(TaskMonad);
