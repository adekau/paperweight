import { Reader, getSemigroup, local, getMonoid, ask, bind, asks } from '../../src/Monad/Reader';
import { log } from '../../src/Monad/Console';
import { semigroupSum, semigroupProd } from '../../src/Monad/Semigroup';
import { fold, monoidSum, monoidProd } from '../../src/Monad/Monoid';
import { pipe } from '../../src/Monad/Pipeable';

describe('Reader Monad', () => {
    it('lifts', () => {
        const r = Reader.of(5);

        expect(r(10)).toBe(5);
        expect(r(5000)).toBe(5);
        expect(r(-100)).toBe(5);
        expect(r('hello')).toBe(5);
        expect(r(false)).toBe(5);
    });

    it('maps', () => {
        const r: Reader<number, string> = n => `Your number is ${n}`;
        console.log = jasmine.createSpy('log');
        const r2 = Reader.map(r, str => log(str));
        r2(15)();

        expect(console.log).toHaveBeenCalledWith('Your number is 15');
    });

    it('binds', () => {
        const r: Reader<number, string> = n => `Your number is ${n}`;
        console.log = jasmine.createSpy('log');
        const r2 = Reader.bind(r, str => Reader.of(log(str)));
        r2(15)();

        expect(console.log).toHaveBeenCalledWith('Your number is 15');
    });

    it('applies', () => {
        const r = Reader.of((x: number) => x * 2);
        const result = Reader.ap(r, Reader.of(5));

        expect(result('anything')).toBe(10);
    });

    it('local', () => {
        const mult2 = (x: number) => x * 2;
        const l = local(mult2);
        const r: Reader<number, string> = (n: number) => `Your number is ${n}`;

        expect(l(r)(5)).toEqual('Your number is 10');
    });

    describe('Semigroup', () => {
        it('concats', () => {
            const s = getSemigroup(semigroupSum);
            const s2 = getSemigroup(semigroupProd);
            const r = s.concat(Reader.of(5), Reader.of(68));
            const r2 = s2.concat(Reader.of(5), Reader.of(68));

            expect(r('anything')).toBe(5 + 68);
            expect(r2('anything')).toBe(5 * 68);
        });
    });

    describe('Monoid', () => {
        it('folds', () => {
            const m = getMonoid(monoidSum);
            const m2 = getMonoid(monoidProd);
            const r = fold(m)([Reader.of(5), Reader.of(68)]);
            const r2 = fold(m2)([Reader.of(5), Reader.of(68)]);

            expect(r('anything')).toBe(5 + 68);
            expect(r2('anything')).toBe(5 * 68);
        });
    });

    describe('Environment', () => {
        interface Dependencies {
            id: number;
            data: string;
        };

        const r = (n: boolean): Reader<Dependencies, string> => (deps: Dependencies) => n ? `Data for ${deps.id}: ${deps.data}` : `Must equal id`;
        it('dependency injection', () => {
            const f = (n: number): Reader<Dependencies, string> => pipe(
                ask<Dependencies>(),
                bind(deps => r(n === deps.id))
            );
            const deps: Dependencies = {
                id: 5,
                data: 'Hello world!'
            };

            expect(f(4)(deps)).toBe(`Must equal id`);
            expect(f(5)(deps)).toBe(`Data for 5: Hello world!`);
        });

        it('dependency injection', () => {
            const f = (n: number): Reader<Dependencies, string> => pipe(
                asks<Dependencies, number>(deps => deps.id),
                bind(id => r(n === id))
            );
            const deps: Dependencies = {
                id: 5,
                data: 'Hello world!'
            };

            expect(f(4)(deps)).toBe(`Must equal id`);
            expect(f(5)(deps)).toBe(`Data for 5: Hello world!`);
        });
    });
});
