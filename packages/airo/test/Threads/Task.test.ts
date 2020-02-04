import { pipe } from '../../src/Monad/Pipeable';
import { bind, map, of, sfunc, Task, TaskMonad } from '../../src/Threads/Task';

describe('Task', () => {
    describe('constructor', () => {
        it('is defined', () => {
            const t = new Task({
                id: 1,
                func: (x: number) => x * 2
            });
            expect(t.func).toBeDefined();
            expect(t.id).toBe(1);
            expect(t.state).toBe('todo');
            expect(t.startTime).toBeUndefined();
        });

        it('can construct with just a func', () => {
            const lastId: number = Task.taskCounter;
            const fn = (x: number) => x + 5;
            const task = new Task(fn);

            expect(task.func).toEqual(fn);
            expect(task.id).toBe(lastId + 1);
            expect(task.state).toBe('todo');
            expect(task.startTime).toBeUndefined();
        });
    });

    it('should execute task', async () => {
        const fn = (x: number) => x * 2;
        const t = new Task({
            id: 1,
            func: fn
        });
        expect(await t.run(5)).toBe(10);
        expect(t.state).toBe('done');
    });

    it('should execute async fn', async () => {
        const mult2 = async (x: number) => x * 2;
        const t = new Task({
            id: 1,
            func: mult2
        });
        expect(await t.run(6)).toBe(12);
        expect(t.state).toBe('done');
    });

    it('handles errors', async (done) => {
        const divide5ByX = (x: number) => {
            if (x === 0)
                throw new Error('divide by 0')
            else
                return 5 / x;
        };

        const t = new Task({
            id: 1,
            func: divide5ByX
        });

        t.run(0).then(res => fail(`resolved with ${res}`))
            .catch(() => {
                expect(t.state).toBe('error');
                done();
            });
    });

    describe('Monad', () => {
        const f1 = (x: number) => x + 15;
        const f2 = (x: number) => x.toString();

        it('can be mapped', async () => {
            const task = new Task({ id: 1, func: f1 });
            const newTask = task.map(f => (x: number) => f2(f(x)));

            expect(await newTask.run(5)).toBe('20');
        });

        it('can map on string funcs', async () => {
            const task = TaskMonad.of(sfunc<number, number>`x => x + 38`);
            const task2 = task.map(f => (x: number) => f(x) + 15);

            expect(await task2.run(2)).toBe(55);
        });

        it('is applicative', async () => {
            const lastId = Task.taskCounter;
            const task = TaskMonad.of((x: number) => x * 4);

            expect(task.id).toBe(lastId + 1);
            expect(await task.run(5)).toBe(20);
        });

        it('can be applied', async () => {
            const f = (f_1: (x: number) => number): ((x: number) => string) =>
                (x: number) => f_1(x).toString();

            const task = TaskMonad.of(f);
            const task2 = task.ap(TaskMonad.of(f1));

            expect(await task2.run(6)).toBe('21');
        });

        it('is bindable', async () => {
            const task = TaskMonad.of(f1);
            const newTask = task.bind(f => TaskMonad.of((x: number) => f2(f(x))));

            expect(await newTask.run(51)).toBe('66');
        });
    });

    describe('Pipeable', () => {
        const f1 = (x: number) => x * 2;
        const f2 = (x: number) => x > 5;

        it('is pipeable', async () => {
            const p = pipe(
                f1,
                of(),
                map(f => (x: number) => f2(f(x))),
                bind(g => TaskMonad.of((x: number) => !g(x))),
                bind(h => TaskMonad.of((x: number) => h(x) ? 'hello' : 'world'))
            );

            expect(await p.run(15)).toBe('world');
        });
    });
});
