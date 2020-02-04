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
var Pipeable_1 = require("../../src/Monad/Pipeable");
var Task_1 = require("../../src/Threads/Task");
describe('Task', function () {
    describe('constructor', function () {
        it('is defined', function () {
            var t = new Task_1.Task({
                id: 1,
                func: function (x) { return x * 2; }
            });
            expect(t.func).toBeDefined();
            expect(t.id).toBe(1);
            expect(t.state).toBe('todo');
            expect(t.startTime).toBeUndefined();
        });
        it('can construct with just a func', function () {
            var lastId = Task_1.Task.taskCounter;
            var fn = function (x) { return x + 5; };
            var task = new Task_1.Task(fn);
            expect(task.func).toEqual(fn);
            expect(task.id).toBe(lastId + 1);
            expect(task.state).toBe('todo');
            expect(task.startTime).toBeUndefined();
        });
    });
    it('should execute task', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fn, t, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = function (x) { return x * 2; };
                    t = new Task_1.Task({
                        id: 1,
                        func: fn
                    });
                    _a = expect;
                    return [4 /*yield*/, t.run(5)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(10);
                    expect(t.state).toBe('done');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should execute async fn', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mult2, t, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mult2 = function (x) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, x * 2];
                    }); }); };
                    t = new Task_1.Task({
                        id: 1,
                        func: mult2
                    });
                    _a = expect;
                    return [4 /*yield*/, t.run(6)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(12);
                    expect(t.state).toBe('done');
                    return [2 /*return*/];
            }
        });
    }); });
    it('handles errors', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var divide5ByX, t;
        return __generator(this, function (_a) {
            divide5ByX = function (x) {
                if (x === 0)
                    throw new Error('divide by 0');
                else
                    return 5 / x;
            };
            t = new Task_1.Task({
                id: 1,
                func: divide5ByX
            });
            t.run(0).then(function (res) { return fail("resolved with " + res); })
                .catch(function () {
                expect(t.state).toBe('error');
                done();
            });
            return [2 /*return*/];
        });
    }); });
    describe('Monad', function () {
        var f1 = function (x) { return x + 15; };
        var f2 = function (x) { return x.toString(); };
        it('can be mapped', function () { return __awaiter(void 0, void 0, void 0, function () {
            var task, newTask, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        task = new Task_1.Task({ id: 1, func: f1 });
                        newTask = task.map(function (f) { return function (x) { return f2(f(x)); }; });
                        _a = expect;
                        return [4 /*yield*/, newTask.run(5)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('20');
                        return [2 /*return*/];
                }
            });
        }); });
        it('can map on string funcs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var task, task2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        task = Task_1.TaskMonad.of(Task_1.sfunc(templateObject_1 || (templateObject_1 = __makeTemplateObject(["x => x + 38"], ["x => x + 38"]))));
                        task2 = task.map(function (f) { return function (x) { return f(x) + 15; }; });
                        _a = expect;
                        return [4 /*yield*/, task2.run(2)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(55);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is applicative', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastId, task, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        lastId = Task_1.Task.taskCounter;
                        task = Task_1.TaskMonad.of(function (x) { return x * 4; });
                        expect(task.id).toBe(lastId + 1);
                        _a = expect;
                        return [4 /*yield*/, task.run(5)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe(20);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can be applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var f, task, task2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        f = function (f_1) {
                            return function (x) { return f_1(x).toString(); };
                        };
                        task = Task_1.TaskMonad.of(f);
                        task2 = task.ap(Task_1.TaskMonad.of(f1));
                        _a = expect;
                        return [4 /*yield*/, task2.run(6)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('21');
                        return [2 /*return*/];
                }
            });
        }); });
        it('is bindable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var task, newTask, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        task = Task_1.TaskMonad.of(f1);
                        newTask = task.bind(function (f) { return Task_1.TaskMonad.of(function (x) { return f2(f(x)); }); });
                        _a = expect;
                        return [4 /*yield*/, newTask.run(51)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('66');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Pipeable', function () {
        var f1 = function (x) { return x * 2; };
        var f2 = function (x) { return x > 5; };
        it('is pipeable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var p, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        p = Pipeable_1.pipe(f1, Task_1.of(), Task_1.map(function (f) { return function (x) { return f2(f(x)); }; }), Task_1.bind(function (g) { return Task_1.TaskMonad.of(function (x) { return !g(x); }); }), Task_1.bind(function (h) { return Task_1.TaskMonad.of(function (x) { return h(x) ? 'hello' : 'world'; }); }));
                        _a = expect;
                        return [4 /*yield*/, p.run(15)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('world');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
var templateObject_1;
//# sourceMappingURL=Task.test.js.map