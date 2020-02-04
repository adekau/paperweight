"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var Task_1 = require("../../src/Threads/Task");
var Thread_1 = require("../../src/Threads/Thread");
function threadTerminate(th) {
    console.error(th.id + ' terminated');
}
describe('Thread', function () {
    it('creates a thread', function () {
        var thread = new Thread_1.Thread({
            id: 1
        });
        expect(thread).toBeDefined();
        expect(thread.id).toBe(1);
        expect(thread.state).toBe('idle');
        expect(thread.tasks).toEqual([]);
    });
    it('runs a task on a thread', function () { return __awaiter(void 0, void 0, void 0, function () {
        var thread, task, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thread = new Thread_1.Thread({
                        id: 1,
                        onTaskDone: jasmine.createSpy('taskDone'),
                        onTerminate: threadTerminate
                    });
                    task = new Task_1.Task({
                        id: 1,
                        func: function (x) { return x * 2; }
                    });
                    thread.run(task, 15);
                    return [4 /*yield*/, task.done()];
                case 1:
                    result = _a.sent();
                    expect(thread.onTaskDone).toHaveBeenCalled();
                    expect(task.state).toBe('done');
                    expect(result).toBe(30);
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs an async task on a thread', function () { return __awaiter(void 0, void 0, void 0, function () {
        var thread, task, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thread = new Thread_1.Thread({
                        id: 1,
                        onTaskDone: jasmine.createSpy('taskDone'),
                        onTerminate: threadTerminate
                    });
                    task = new Task_1.Task({
                        id: 1,
                        // async functions like so will need to be strings or else tsc transorms it
                        // to `__awaiter` which doesn't exist on the worker thread.
                        func: Task_1.sfunc(templateObject_1 || (templateObject_1 = __makeTemplateObject(["async x => x * 2"], ["async x => x * 2"])))
                    });
                    thread.run(task, 17);
                    return [4 /*yield*/, task.done()];
                case 1:
                    result = _a.sent();
                    expect(thread.onTaskDone).toHaveBeenCalled();
                    expect(task.state).toBe('done');
                    expect(result).toBe(34);
                    return [2 /*return*/];
            }
        });
    }); });
    it('adds and removes to the task queue', function () { return __awaiter(void 0, void 0, void 0, function () {
        var thread, task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thread = new Thread_1.Thread({
                        id: 1
                    });
                    task = new Task_1.Task({
                        id: 1,
                        func: function () { return new Promise(function (resolve, _) { return setTimeout(function () { return resolve(5); }, 500); }); }
                    });
                    thread.run(task);
                    expect(thread.state).toBe('running');
                    expect(thread.tasks.length).toBe(1);
                    return [4 /*yield*/, task.done()];
                case 1:
                    _a.sent();
                    expect(thread.state).toBe('idle');
                    expect(thread.tasks.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Queues multiple tasks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var thread, task, task2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thread = new Thread_1.Thread({
                        id: 1
                    });
                    task = new Task_1.Task({
                        id: 1,
                        func: function () { return new Promise(function (resolve, _) { return setTimeout(function () { return resolve(5); }, 500); }); }
                    });
                    task2 = new Task_1.Task({
                        id: 2,
                        func: function () { return new Promise(function (resolve, _) { return setTimeout(function () { return resolve(5); }, 750); }); }
                    });
                    thread.run(task);
                    thread.run(task2);
                    expect(thread.state).toBe('running');
                    expect(thread.tasks.length).toBe(2);
                    return [4 /*yield*/, task.done()];
                case 1:
                    _a.sent();
                    expect(thread.state).toBe('running');
                    expect(thread.tasks.length).toBe(1);
                    return [4 /*yield*/, task2.done()];
                case 2:
                    _a.sent();
                    expect(thread.state).toBe('idle');
                    expect(thread.tasks.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles rejections', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var thread, task;
        return __generator(this, function (_a) {
            thread = new Thread_1.Thread({
                id: 1
            });
            task = new Task_1.Task({
                id: 1,
                func: function (x) { return new Promise(function (res, rej) { return x === 0 ? rej('cant divide by 0') : res(5 / x); }); }
            });
            thread.run(task, 0);
            task.done().then(function (r) {
                fail("Should not have resolved (resolved with: " + r + ")");
            }).catch(function (_) { return done(); });
            return [2 /*return*/];
        });
    }); });
    it('sets globals', function () { return __awaiter(void 0, void 0, void 0, function () {
        var glbls, thread, task, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    glbls = {
                        name: 'Alex',
                        age: 24
                    };
                    thread = new Thread_1.Thread({
                        id: 1
                    });
                    return [4 /*yield*/, thread.setOrMergeGlobals(glbls)];
                case 1:
                    _a.sent();
                    task = new Task_1.Task({
                        id: 2,
                        func: Task_1.sfunc(templateObject_2 || (templateObject_2 = __makeTemplateObject(["() => global.name + ' is ' + global.age"], ["() => global.name + ' is ' + global.age"])))
                    });
                    thread.run(task);
                    return [4 /*yield*/, task.done()];
                case 2:
                    result = _a.sent();
                    expect(result).toBe('Alex is 24');
                    expect(Object.keys(thread.globals)).toEqual(Object.keys(glbls));
                    expect(Object.values(thread.globals)).toEqual(Object.values(glbls));
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs two threads at the same time', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var thread1, thread2, fn, task1, task2;
        return __generator(this, function (_a) {
            thread1 = new Thread_1.Thread({ id: 1 });
            thread2 = new Thread_1.Thread({ id: 2 });
            fn = function () { return new Promise(function (res, _) { return setTimeout(function () { return (res()); }, 500); }); };
            task1 = new Task_1.Task({ id: 1, func: fn });
            task2 = new Task_1.Task({ id: 2, func: fn });
            thread1.run(task1);
            thread2.run(task2);
            expect(thread1.state).toBe('running');
            expect(thread2.state).toBe('running');
            setTimeout(function () {
                expect(task1.state).toBe('done');
                expect(task2.state).toBe('done');
                expect(thread1.state).toBe('idle');
                expect(thread2.state).toBe('idle');
                done();
            }, 600);
            return [2 /*return*/];
        });
    }); });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Thread.test.js.map