"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var Task_1 = require("./Task");
/**
 * A thread for allowing tasks to run in parallel.
 * @param config ThreadConfig object to configure the thread.
 */
var Thread = /** @class */ (function () {
    function Thread(config) {
        var _this = this;
        this.onTaskDone = helpers_1.noOp;
        this.onTerminate = helpers_1.noOp;
        Object.assign(this, config);
        this.state = 'idle';
        this.tasks = [];
        this.globals = [];
        this._worker = new Worker(helpers_1.fnToURL(workerMain));
        this._worker.addEventListener('message', function (_a) {
            var data = _a.data;
            return (_this._handleWorkerMessage(data));
        });
    }
    Thread.prototype._handleWorkerMessage = function (message) {
        var taskIdx = this.tasks.findIndex(function (task) { return message.id === task.id; });
        if (taskIdx === undefined)
            return;
        var task = this.tasks[taskIdx];
        if (message.type === 'error')
            task.reject(new Error(String(message.error)));
        if (message.type === 'result')
            task.resolve(message.result);
        this.onTaskDone(this);
        if (this.tasks.length === 1)
            this.state = 'idle';
        this.tasks.splice(taskIdx, 1);
    };
    /**
     * Run a task on this thread.
     * @param task The task instance to execute on the thread.
     * @param args The argument array or comma separated argument list to pass to the task's function.
     * @returns void
     */
    Thread.prototype.run = function (task) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.tasks.push(task);
        var message = {
            type: 'run',
            id: task.id,
            func: task.func.toString()
        };
        // add arguments for spawned thread to parse.
        Object.keys(args).forEach(function (_, i) { return message['argument' + i] = args[i]; });
        this.state = 'running';
        task.state = 'running';
        this.postMessage(message, []);
    };
    ;
    /**
     * Post a message to be handled on the thread.
     * @param msg The message to send the thread. Must be of type `run`.
     * @param transferables Objects that will have ownership transferred to the thread and will
     * cease to exist on the main thread. E.g. `Uint8Array`, `ArrayBuffer`.
     */
    Thread.prototype.postMessage = function (msg, transferables) {
        this._worker.postMessage(msg, transferables);
    };
    /**
     * Set properties global to any task that runs on this thread.
     * @param globals Sets properties that can be accessed from any task run in the thread.
     * Accessible through `self.key` or `global.key`. `global` is a proxy.
     * @returns Promise<void>
     */
    Thread.prototype.setOrMergeGlobals = function (globals) {
        Object.assign(this.globals, globals);
        var setGlobalTask = new Task_1.Task(setGlobals);
        this.run(setGlobalTask, this.globals);
        return setGlobalTask.done();
    };
    return Thread;
}());
exports.Thread = Thread;
/**
 * Main function that executes on the spawned thread.
 */
var workerMain = "function() {\n    const global = new Proxy({}, {\n        get: (obj, prop) => (self[prop]),\n        set: (obj, prop, newval) => (self[prop] = newval)\n    });\n\n    onmessage = function (ev) {\n        const msg = ev.data;\n\n        if (msg.type !== 'run')\n            return;\n\n        const args = Object.keys(msg)\n            .filter(key => key.match(/^argument/))\n            .sort((a, b) => parseInt(a.slice(8), 10) - parseInt(b.slice(8), 10)) // remove word 'argument'\n            .map(key => msg[key]);\n\n        try {\n            const result = eval('(' + msg.func + ')').apply(undefined, args);\n            if (result && result.then && result.catch)\n                result\n                    .then(res => self.postMessage({ type: 'result', id: msg.id, result: res }))\n                    .catch(err => self.postMessage({ type: 'error', id: msg.id, error: err.stack }));\n            else\n                self.postMessage({ type: 'result', id: msg.id, result });\n        } catch (e) {\n            self.postMessage({ type: 'error', id: msg.id, error: e.stack });\n        }\n    }\n};";
var setGlobals = Task_1.sfunc(templateObject_1 || (templateObject_1 = __makeTemplateObject(["function (g) {\n    if (g !== undefined)\n        Object.keys(g).forEach(k => global[k] = g[k]);\n}"], ["function (g) {\n    if (g !== undefined)\n        Object.keys(g).forEach(k => global[k] = g[k]);\n}"])));
var templateObject_1;
//# sourceMappingURL=Thread.js.map