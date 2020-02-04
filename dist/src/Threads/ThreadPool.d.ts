import { Task } from './Task';
export declare type ThreadPoolConfig = {
    id?: number;
    maxThreads?: number;
    maxTasksPerThread?: number;
    globals?: {
        [global: string]: any;
    };
};
/**
 * Manages multiple threads and executes a task on the next available thread.
 * @param config ThreadPoolConfig object to configure the thread pool.
 */
export declare class ThreadPool {
    static poolCount: number;
    static taskCount: number;
    readonly id: number;
    maxThreads: number;
    maxTasksPerThread: number;
    globals: {
        [global: string]: any;
    };
    private _threads;
    private _taskQueue;
    private _taskArgs;
    private _terminated;
    private _lastWorkerId;
    constructor(config?: ThreadPoolConfig);
    get threadCount(): number;
    terminate(): void;
    run<T extends (...args: any[]) => any>(func: T, ...args: Parameters<T>): Task<T>;
    private _runNext;
    private _tryGetIdleThread;
    private _createThread;
}
