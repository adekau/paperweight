import { fnToURL, noOp } from './helpers';
import { sfunc, Task } from './Task';
/**
 * A thread for allowing tasks to run in parallel.
 * @param config ThreadConfig object to configure the thread.
 */
export class Thread {
    constructor(config) {
        this.onTaskDone = noOp;
        this.onTerminate = noOp;
        Object.assign(this, config);
        this.state = 'idle';
        this.tasks = [];
        this.globals = [];
        this._worker = new Worker(fnToURL(workerMain));
        this._worker.addEventListener('message', ({ data }) => (this._handleWorkerMessage(data)));
    }
    _handleWorkerMessage(message) {
        const taskIdx = this.tasks.findIndex(task => message.id === task.id);
        if (taskIdx === undefined)
            return;
        const task = this.tasks[taskIdx];
        if (message.type === 'error')
            task.reject(new Error(String(message.error)));
        if (message.type === 'result')
            task.resolve(message.result);
        this.onTaskDone(this);
        if (this.tasks.length === 1)
            this.state = 'idle';
        this.tasks.splice(taskIdx, 1);
    }
    /**
     * Run a task on this thread.
     * @param task The task instance to execute on the thread.
     * @param args The argument array or comma separated argument list to pass to the task's function.
     * @returns void
     */
    run(task, ...args) {
        this.tasks.push(task);
        const message = {
            type: 'run',
            id: task.id,
            func: task.func.toString()
        };
        // add arguments for spawned thread to parse.
        Object.keys(args).forEach((_, i) => message['argument' + i] = args[i]);
        this.state = 'running';
        task.state = 'running';
        this.postMessage(message, []);
    }
    ;
    /**
     * Post a message to be handled on the thread.
     * @param msg The message to send the thread. Must be of type `run`.
     * @param transferables Objects that will have ownership transferred to the thread and will
     * cease to exist on the main thread. E.g. `Uint8Array`, `ArrayBuffer`.
     */
    postMessage(msg, transferables) {
        this._worker.postMessage(msg, transferables);
    }
    /**
     * Set properties global to any task that runs on this thread.
     * @param globals Sets properties that can be accessed from any task run in the thread.
     * Accessible through `self.key` or `global.key`. `global` is a proxy.
     * @returns Promise<void>
     */
    setOrMergeGlobals(globals) {
        Object.assign(this.globals, globals);
        const setGlobalTask = new Task(setGlobals);
        this.run(setGlobalTask, this.globals);
        return setGlobalTask.done();
    }
}
/**
 * Main function that executes on the spawned thread.
 */
const workerMain = `function() {
    const global = new Proxy({}, {
        get: (obj, prop) => (self[prop]),
        set: (obj, prop, newval) => (self[prop] = newval)
    });

    onmessage = function (ev) {
        const msg = ev.data;

        if (msg.type !== 'run')
            return;

        const args = Object.keys(msg)
            .filter(key => key.match(/^argument/))
            .sort((a, b) => parseInt(a.slice(8), 10) - parseInt(b.slice(8), 10)) // remove word 'argument'
            .map(key => msg[key]);

        try {
            const result = eval('(' + msg.func + ')').apply(undefined, args);
            if (result && result.then && result.catch)
                result
                    .then(res => self.postMessage({ type: 'result', id: msg.id, result: res }))
                    .catch(err => self.postMessage({ type: 'error', id: msg.id, error: err.stack }));
            else
                self.postMessage({ type: 'result', id: msg.id, result });
        } catch (e) {
            self.postMessage({ type: 'error', id: msg.id, error: e.stack });
        }
    }
};`;
const setGlobals = sfunc `function (g) {
    if (g !== undefined)
        Object.keys(g).forEach(k => global[k] = g[k]);
}`;
//# sourceMappingURL=Thread.js.map