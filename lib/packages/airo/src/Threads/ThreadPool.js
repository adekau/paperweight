import { Thread } from './Thread';
import { Task } from './Task';
/**
 * Manages multiple threads and executes a task on the next available thread.
 * @param config ThreadPoolConfig object to configure the thread pool.
 */
export class ThreadPool {
    constructor(config) {
        this.id = config?.id ?? ++ThreadPool.poolCount;
        this._terminated = false;
        this._threads = [];
        this._taskQueue = [];
        this._lastWorkerId = 0;
        this._taskArgs = new WeakMap();
        this.maxThreads = config?.maxThreads || navigator.hardwareConcurrency;
        this.maxTasksPerThread = config?.maxTasksPerThread || 1;
        this.globals = config?.globals ?? {};
    }
    get threadCount() {
        return this._threads.length;
    }
    terminate() {
        this._terminated = true;
        // TODO: terminate each thread.
    }
    run(func, ...args) {
        if (this._terminated)
            throw new Error(`ThreadPool ${this.id} is terminated.`);
        const task = new Task({
            id: ++ThreadPool.taskCount,
            func
        });
        this._taskQueue.push(task);
        this._taskArgs.set(task, args);
        this._runNext();
        return task;
    }
    _runNext() {
        if (this._terminated)
            throw new Error(`ThreadPool ${this.id} is terminated.`);
        const thread = this._tryGetIdleThread();
        if (!thread) {
            setTimeout(this._runNext.bind(this), 15);
            return;
        }
        const nextTask = this._taskQueue.shift();
        if (!nextTask)
            return;
        const taskArgs = this._taskArgs.get(nextTask) || [];
        thread.run(nextTask, ...taskArgs);
    }
    _tryGetIdleThread() {
        if (this._terminated)
            throw new Error(`ThreadPool ${this.id} is terminated.`);
        const idleThreads = this._threads
            .filter(thread => thread.tasks.length <= this.maxTasksPerThread)
            .sort((a, b) => a.tasks.length - b.tasks.length);
        if (idleThreads.length)
            return idleThreads[0];
        else if (this.threadCount < this.maxThreads)
            return this._createThread();
        else
            return undefined;
    }
    _createThread() {
        const thread = new Thread({
            id: ++this._lastWorkerId
        });
        this._threads.push(thread);
        return thread;
    }
}
ThreadPool.poolCount = 0;
ThreadPool.taskCount = 0;
;
//# sourceMappingURL=ThreadPool.js.map