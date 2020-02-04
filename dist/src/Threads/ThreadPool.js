"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Thread_1 = require("./Thread");
var Task_1 = require("./Task");
/**
 * Manages multiple threads and executes a task on the next available thread.
 * @param config ThreadPoolConfig object to configure the thread pool.
 */
var ThreadPool = /** @class */ (function () {
    function ThreadPool(config) {
        var _a, _b, _c, _d, _e, _f;
        this.id = (_b = (_a = config) === null || _a === void 0 ? void 0 : _a.id, (_b !== null && _b !== void 0 ? _b : ++ThreadPool.poolCount));
        this._terminated = false;
        this._threads = [];
        this._taskQueue = [];
        this._lastWorkerId = 0;
        this._taskArgs = new WeakMap();
        this.maxThreads = ((_c = config) === null || _c === void 0 ? void 0 : _c.maxThreads) || navigator.hardwareConcurrency;
        this.maxTasksPerThread = ((_d = config) === null || _d === void 0 ? void 0 : _d.maxTasksPerThread) || 1;
        this.globals = (_f = (_e = config) === null || _e === void 0 ? void 0 : _e.globals, (_f !== null && _f !== void 0 ? _f : {}));
    }
    Object.defineProperty(ThreadPool.prototype, "threadCount", {
        get: function () {
            return this._threads.length;
        },
        enumerable: true,
        configurable: true
    });
    ThreadPool.prototype.terminate = function () {
        this._terminated = true;
        // TODO: terminate each thread.
    };
    ThreadPool.prototype.run = function (func) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._terminated)
            throw new Error("ThreadPool " + this.id + " is terminated.");
        var task = new Task_1.Task({
            id: ++ThreadPool.taskCount,
            func: func
        });
        this._taskQueue.push(task);
        this._taskArgs.set(task, args);
        this._runNext();
        return task;
    };
    ThreadPool.prototype._runNext = function () {
        if (this._terminated)
            throw new Error("ThreadPool " + this.id + " is terminated.");
        var thread = this._tryGetIdleThread();
        if (!thread) {
            setTimeout(this._runNext.bind(this), 15);
            return;
        }
        var nextTask = this._taskQueue.shift();
        if (!nextTask)
            return;
        var taskArgs = this._taskArgs.get(nextTask) || [];
        thread.run.apply(thread, __spreadArrays([nextTask], taskArgs));
    };
    ThreadPool.prototype._tryGetIdleThread = function () {
        var _this = this;
        if (this._terminated)
            throw new Error("ThreadPool " + this.id + " is terminated.");
        var idleThreads = this._threads
            .filter(function (thread) { return thread.tasks.length <= _this.maxTasksPerThread; })
            .sort(function (a, b) { return a.tasks.length - b.tasks.length; });
        if (idleThreads.length)
            return idleThreads[0];
        else if (this.threadCount < this.maxThreads)
            return this._createThread();
        else
            return undefined;
    };
    ThreadPool.prototype._createThread = function () {
        var thread = new Thread_1.Thread({
            id: ++this._lastWorkerId
        });
        this._threads.push(thread);
        return thread;
    };
    ThreadPool.poolCount = 0;
    ThreadPool.taskCount = 0;
    return ThreadPool;
}());
exports.ThreadPool = ThreadPool;
;
//# sourceMappingURL=ThreadPool.js.map