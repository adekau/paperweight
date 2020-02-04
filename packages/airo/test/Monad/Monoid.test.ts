import { fold, monoidAll, monoidAny, monoidSum, monoidProd, monoidString, monoidVoid } from '../../src/Monad/Monoid';

describe('Monoid', () => {
    describe('Fold', () => {
        it('All', () => {
            const all = fold(monoidAll);
            expect(all([true, true, true, true])).toBe(true);
            expect(all([false, true, true, true])).toBe(false);
            expect(all([true, false, true, true])).toBe(false);
            expect(all([true, true, false, true])).toBe(false);
            expect(all([true, true, true, false])).toBe(false);
            expect(all([true])).toBe(true);
            expect(all([])).toBe(true);
        });

        it('Any', () => {
            const any = fold(monoidAny);
            expect(any([true, true, true, true])).toBe(true);
            expect(any([false, true, true, true])).toBe(true);
            expect(any([true, false, true, true])).toBe(true);
            expect(any([true, true, false, true])).toBe(true);
            expect(any([true, true, true, false])).toBe(true);
            expect(any([true])).toBe(true);
            expect(any([false])).toBe(false);
            expect(any([false, false])).toBe(false);
            expect(any([])).toBe(false);
        });

        it('Sum', () => {
            const sum = fold(monoidSum);
            expect(sum([1, 2, 3, 4])).toBe(10);
            expect(sum([1, 2, -3, 4])).toBe(4);
            expect(sum([NaN, 2, 3, 4])).toEqual(NaN);
            expect(sum([])).toBe(0);
        });

        it('Prod', () => {
            const prod = fold(monoidProd);
            expect(prod([1, 2, 3, 4])).toBe(24);
            expect(prod([1, 2, -3, 4])).toBe(-24);
            expect(prod([NaN, 2, 3, 4])).toEqual(NaN);
            expect(prod([])).toBe(1);
        });

        it('String', () => {
            const str = fold(monoidString);
            expect(str(['Hello ', 'world', '!'])).toBe('Hello world!');
            expect(str([])).toBe('');
        });

        it('Void', () => {
            const vd = fold(monoidVoid);
            expect(vd([void 1, void 2])).toBe(void 0);
            expect(vd([])).toBe(void 0);
        });
    });
});
