import { bind, IO, map, of } from '../../src/Monad/IO';
import { pipe } from '../../src/Monad/Pipeable';

const io = IO.of('Hello world!');
describe('IO Monad', () => {
    it('constructs', () => {
        expect(io()).toBe('Hello world!');
    });

    it('maps', () => {
        const newIO = IO.map(io, s => s.length);
        expect(newIO()).toBe(12);
    });

    it('applies', () => {
        const fnIO = IO.of((x: number) => x * 2);
        expect(IO.ap(fnIO, IO.of(5))()).toBe(10);
    });

    it('binds/chains', () => {
        const newIO = IO.bind(io, a => IO.of(a + ':)'));
        expect(newIO()).toBe('Hello world!:)');
    });

    it('pipes', () => {
        const t = pipe(
            5,
            of(),
            map(x => x + 5),
            map(x => x.toString()),
            bind(x => IO.of(x + '!'))
        );
        expect(t()).toBe('10!');
    });

    it('pipes with actual io', () => {
        console.log = jasmine.createSpy('log');
        const t = pipe(
            5,
            of(),
            map(x => console.log(x))
        );
        expect(t).not.toThrow();
        expect(console.log).toHaveBeenCalled();
    });
});
