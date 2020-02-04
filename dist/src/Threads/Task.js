"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Pipeable_1 = require("../Monad/Pipeable");
;
var HKTId = 'Task';
;
/**
 * A deferred computation that can be run asynchronously or in parallel on a thread.
 * @param opts The options to use on Task creation.
 */
var Task = /** @class */ (function () {
    function Task(arg) {
        var _this = this;
        var _a, _b;
        this.id = (_a = arg.id, (_a !== null && _a !== void 0 ? _a : Task.getNextId()));
        this.func = (_b = arg.func, (_b !== null && _b !== void 0 ? _b : arg));
        this._promise = new Promise(function (resolve, reject) {
            _this.resolve = function (value) {
                _this.state = 'done';
                resolve(value);
            };
            _this.reject = function (reason) {
                _this.state = 'error';
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
    Task.getNextId = function () {
        return ++Task.taskCounter;
    };
    /**
     * Runs the task.
     * @param args Arguments to run the task's function with.
     * @returns Promise<T>
     */
    Task.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.state = 'running';
        this.startTime = new Date();
        try {
            var result = this.func.apply(this, args);
            this.state = 'done';
            this.resolve(result);
        }
        catch (e) {
            this.state = 'error';
            this.reject(e);
        }
        return this.done();
    };
    /**
     * Maps from one function to another in a new Task.
     * @param f A function from the calling task's `func` type to a new `func` type.
     * @example TaskMonad.of((x: number) => x + 1).map(f => (x: number) => f(x) * 2)
     */
    Task.prototype.map = function (f) {
        return exports.TaskMonad.map(this, f);
    };
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
    Task.prototype.ap = function (fa) {
        return exports.TaskMonad.ap(this, fa);
    };
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
    Task.prototype.bind = function (f) {
        return exports.TaskMonad.bind(this, f);
    };
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
    Task.prototype.done = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this._promise
                        .then(function (v) { return (_this.state = 'done', v); })
                        .catch(function (e) {
                        _this.state = 'error';
                        throw e;
                    })];
            });
        });
    };
    Task.taskCounter = 0;
    return Task;
}());
exports.Task = Task;
;
/**
 * Contains the functions necessary for using `Task` as a monad.
 */
exports.TaskMonad = {
    HKT: HKTId,
    map: function (fa, f) {
        return new Task({
            id: fa.id,
            func: f(fa.func)
        });
    },
    ap: function (fab, fa) {
        return new Task({
            id: Task.getNextId(),
            func: fab.func(fa.func)
        });
    },
    /**
     * Creates a new Task with an auto generated id.
     * @param a Function to create the task with.
     */
    of: function (a) {
        return new Task({
            id: Task.getNextId(),
            func: a
        });
    },
    bind: function (fa, f) {
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
function sfunc(literals) {
    var vars = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        vars[_i - 1] = arguments[_i];
    }
    var str = "";
    if (vars.length) {
        for (var i = 0; i < vars.length; i++) {
            str += literals[i] + vars[i];
        }
    }
    str += literals[literals.length - 1];
    return eval("(" + str + ")");
}
exports.sfunc = sfunc;
exports.ap = (_a = Pipeable_1.pipeable(exports.TaskMonad), _a.ap), exports.apFirst = _a.apFirst, exports.apSecond = _a.apSecond, exports.bind = _a.bind, exports.bindFirst = _a.bindFirst, exports.flatten = _a.flatten, exports.map = _a.map, exports.of = _a.of;
//# sourceMappingURL=Task.js.map