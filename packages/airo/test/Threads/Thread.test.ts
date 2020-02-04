import { sfunc, Task } from '../../src/Threads/Task';
import { Thread } from '../../src/Threads/Thread';

function threadTerminate(th: Thread) {
    console.error(th.id + ' terminated');
}

describe('Thread', () => {
    it('creates a thread', () => {
        const thread = new Thread({
            id: 1
        });

        expect(thread).toBeDefined();
        expect(thread.id).toBe(1);
        expect(thread.state).toBe('idle');
        expect(thread.tasks).toEqual([]);
    });

    it('runs a task on a thread', async () => {
        const thread = new Thread({
            id: 1,
            onTaskDone: jasmine.createSpy('taskDone'),
            onTerminate: threadTerminate
        });

        const task = new Task({
            id: 1,
            func: (x: number) => x * 2
        });

        thread.run(task, 15);
        const result = await task.done();
        expect(thread.onTaskDone).toHaveBeenCalled();
        expect(task.state).toBe('done');
        expect(result).toBe(30);
    });

    it('runs an async task on a thread', async () => {
        const thread = new Thread({
            id: 1,
            onTaskDone: jasmine.createSpy('taskDone'),
            onTerminate: threadTerminate
        });

        const task = new Task({
            id: 1,
            // async functions like so will need to be strings or else tsc transorms it
            // to `__awaiter` which doesn't exist on the worker thread.
            func: sfunc<number, number>`async x => x * 2`
        });

        thread.run(task, 17);
        const result = await task.done();
        expect(thread.onTaskDone).toHaveBeenCalled();
        expect(task.state).toBe('done');
        expect(result).toBe(34);
    });

    it('adds and removes to the task queue', async () => {
        const thread = new Thread({
            id: 1
        });

        const task = new Task({
            id: 1,
            func: () => new Promise((resolve, _) => setTimeout(() => resolve(5), 500))
        });

        thread.run(task);
        expect(thread.state).toBe('running');
        expect(thread.tasks.length).toBe(1);
        await task.done();
        expect(thread.state).toBe('idle');
        expect(thread.tasks.length).toBe(0);
    });

    it('Queues multiple tasks', async () => {
        const thread = new Thread({
            id: 1
        });

        const task = new Task({
            id: 1,
            func: () => new Promise((resolve, _) => setTimeout(() => resolve(5), 500))
        });
        const task2 = new Task({
            id: 2,
            func: () => new Promise((resolve, _) => setTimeout(() => resolve(5), 750))
        });

        thread.run(task);
        thread.run(task2);
        expect(thread.state).toBe('running');
        expect(thread.tasks.length).toBe(2);
        await task.done();
        expect(thread.state).toBe('running');
        expect(thread.tasks.length).toBe(1);
        await task2.done();
        expect(thread.state).toBe('idle');
        expect(thread.tasks.length).toBe(0);
    });

    it('handles rejections', async (done) => {
        const thread = new Thread({
            id: 1
        });

        const task = new Task({
            id: 1,
            func: (x: number) => new Promise((res, rej) => x === 0 ? rej('cant divide by 0') : res(5 / x))
        });
        thread.run(task, 0);
        task.done().then(r => {
            fail(`Should not have resolved (resolved with: ${r})`);
        }).catch(_ => done());
    });

    it('sets globals', async () => {
        const glbls = {
            name: 'Alex',
            age: 24
        }
        const thread = new Thread({
            id: 1
        });
        await thread.setOrMergeGlobals(glbls);
        const task = new Task({
            id: 2,
            func: sfunc<any, string>`() => global.name + ' is ' + global.age`
        });
        thread.run(task);
        const result = await task.done();
        expect(result).toBe('Alex is 24');
        expect(Object.keys(thread.globals)).toEqual(Object.keys(glbls));
        expect(Object.values(thread.globals)).toEqual(Object.values(glbls));
    });

    it('runs two threads at the same time', async (done) => {
        const thread1 = new Thread({ id: 1 });
        const thread2 = new Thread({ id: 2 });
        const fn = () => new Promise((res, _) => setTimeout(() => (res()), 500));
        const task1 = new Task({ id: 1, func: fn });
        const task2 = new Task({ id: 2, func: fn });

        thread1.run(task1);
        thread2.run(task2);

        expect(thread1.state).toBe('running');
        expect(thread2.state).toBe('running');

        setTimeout(() => {
            expect(task1.state).toBe('done');
            expect(task2.state).toBe('done');
            expect(thread1.state).toBe('idle');
            expect(thread2.state).toBe('idle');

            done();
        }, 600);
    });
});
