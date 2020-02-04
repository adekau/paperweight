import { pipeable } from '../Monad/Pipeable';
;
const HKTId = 'Task';
;
/**
 * A deferred computation that can be run asynchronously or in parallel on a thread.
 * @param opts The options to use on Task creation.
 */
export class Task {
    constructor(arg) {
        this.id = arg.id ?? Task.getNextId();
        this.func = arg.func ?? arg;
        this._promise = new Promise((resolve, reject) => {
            this.resolve = (value) => {
                this.state = 'done';
                resolve(value);
            };
            this.reject = (reason) => {
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
    static getNextId() {
        return ++Task.taskCounter;
    }
    /**
     * Runs the task.
     * @param args Arguments to run the task's function with.
     * @returns Promise<T>
     */
    run(...args) {
        this.state = 'running';
        this.startTime = new Date();
        try {
            const result = this.func(...args);
            this.state = 'done';
            this.resolve(result);
        }
        catch (e) {
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
    map(f) {
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
    ap(fa) {
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
    bind(f) {
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
    async done() {
        return this._promise
            .then((v) => (this.state = 'done', v))
            .catch((e) => {
            this.state = 'error';
            throw e;
        });
    }
}
Task.taskCounter = 0;
;
/**
 * Contains the functions necessary for using `Task` as a monad.
 */
export const TaskMonad = {
    HKT: HKTId,
    map(fa, f) {
        return new Task({
            id: fa.id,
            func: f(fa.func)
        });
    },
    ap(fab, fa) {
        return new Task({
            id: Task.getNextId(),
            func: fab.func(fa.func)
        });
    },
    /**
     * Creates a new Task with an auto generated id.
     * @param a Function to create the task with.
     */
    of(a) {
        return new Task({
            id: Task.getNextId(),
            func: a
        });
    },
    bind(fa, f) {
        return f(fa.func);
    }
};
/**
 * Creates a function from a string. Used when you need async keyword in a task running on a non-main thread.
 * Necessary or else TypeScript will compile the await keyword to a promise using `__awaiter` and `__generator`
 * which are defined in TSLib which is unavailable in threads.
 * @warning Uses `eval` internally to convert string to function, don't expose this function to user input.
 * @example const fn: (x: any) => any = sfunc`(x) => x + 2`;
 */
export function sfunc(literals, ...vars) {
    let str = "";
    if (vars.length) {
        for (let i = 0; i < vars.length; i++) {
            str += literals[i] + vars[i];
        }
    }
    str += literals[literals.length - 1];
    return eval(`(${str})`);
}
export const { ap, apFirst, apSecond, bind, bindFirst, flatten, map, of } = pipeable(TaskMonad);
//# sourceMappingURL=Task.js.map