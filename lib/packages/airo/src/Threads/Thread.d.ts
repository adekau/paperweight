import { Message } from './Message';
import { Task } from './Task';
export declare type ThreadConfig = {
    /**
     * Used to keep track of threads if in a task pool.
     */
    id: number;
    /**
     * Runs when a task completes on a thread.
     * @param thread the thread the task was completed on.
     * @returns void
     */
    onTaskDone?: (thread: Thread) => void;
    /**
     * Runs when a thread dies.
     * @param thread the thread that died.
     * @returns void
     */
    onTerminate?: (thread: Thread) => void;
};
/**
 * A thread for allowing tasks to run in parallel.
 * @param config ThreadConfig object to configure the thread.
 */
export declare class Thread implements ThreadConfig {
    private _worker;
    id: number;
    onTaskDone: (thread: this) => void;
    onTerminate: (thread: this) => void;
    state: 'idle' | 'running';
    tasks: Task<any>[];
    globals: {
        [k: string]: any;
    };
    constructor(config: ThreadConfig);
    private _handleWorkerMessage;
    /**
     * Run a task on this thread.
     * @param task The task instance to execute on the thread.
     * @param args The argument array or comma separated argument list to pass to the task's function.
     * @returns void
     */
    run<T extends (...args: any[]) => any>(task: Task<T>, ...args: Parameters<T>): void;
    /**
     * Post a message to be handled on the thread.
     * @param msg The message to send the thread. Must be of type `run`.
     * @param transferables Objects that will have ownership transferred to the thread and will
     * cease to exist on the main thread. E.g. `Uint8Array`, `ArrayBuffer`.
     */
    postMessage(msg: {
        type: 'run';
    } & Message, transferables: Transferable[]): void;
    /**
     * Set properties global to any task that runs on this thread.
     * @param globals Sets properties that can be accessed from any task run in the thread.
     * Accessible through `self.key` or `global.key`. `global` is a proxy.
     * @returns Promise<void>
     */
    setOrMergeGlobals(globals: {
        [k: string]: any;
    }): Promise<void>;
}
//# sourceMappingURL=Thread.d.ts.map