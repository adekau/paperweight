import { Just, map, of, ap, bind, bindFirst, apSecond, flatten } from '../../src/Monad/Maybe';
import { pipe } from '../../src/Monad/Pipeable';

const incrX = (x: number) => (v: number) => v + x;
const decrX = (x: number) => (v: number) => v - x;
const stringify = (v: number) => v.toString();
const exclaim = (v: string) => v + '!';

describe('Pipe', () => {
    it('simple pipe', () => {
        const mb = pipe(
            5,
            incrX(5),
            decrX(2),
            stringify,
            exclaim
        );
        expect(mb).toBe('8!');
    });

    it('monad pipe', () => {
        const mb = pipe(
            4,
            of(),
            map(incrX(5))
        );
        expect(mb).toEqual(Just(9));
    });

    it('throws error with 0 args', (done) => {
        try {
            expect((pipe as any)());
        } catch {
            done();
            return;
        }
        fail('Should not execute pipe');
    });

    it('applies', () => {
        const m = pipe(
            (x: number) => x * 2,
            of(),
            ap(Just(100)),
            bind(n => Just(n + 5)),
            bindFirst(a => Just(a + 5))
        );

        expect(m).toEqual(Just(205));

        const m2 = pipe(
            (x: number) => x * 2,
            of(),
            ap(Just(100)),
            bind(n => Just(n + 5)),
            apSecond(Just(15))
        );

        expect(m2).toEqual(Just(15));
    });

    it('flattens', () => {
        const m = pipe(
            15,
            of(),
            of()
        );

        expect(m).toEqual(Just(Just(15)));

        const m2 = pipe(
            15,
            of(),
            of(),
            flatten
        );

        expect(m2).toEqual(Just(15));
    });
});
