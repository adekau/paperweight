import { getApplySemigroup as eitherSg, inl, inr } from '../../src/Monad/Either';
import { getApplySemigroup, Just, Nothing } from '../../src/Monad/Maybe';
import {
    fold,
    getFunctionSemigroup,
    getStructSemigroup,
    getTupleSemigroup,
    Semigroup,
    semigroupAll,
    semigroupAny,
    semigroupProd,
    semigroupString,
    semigroupSum,
    semigroupVoid,
    getDualSemigroup,
    getLastSemigroup,
    getFirstSemigroup,
} from '../../src/Monad/Semigroup';

describe('Semigroup', () => {
    type Point = {
        x: number;
        y: number;
    };

    const sgPoint: Semigroup<Point> = getStructSemigroup({
        x: semigroupSum,
        y: semigroupSum
    });

    const sgPred: Semigroup<(p: Point) => boolean> = getFunctionSemigroup(semigroupAll)<Point>();

    const p1: Point = {
        x: 1,
        y: 5
    };

    const p2: Point = {
        x: 6,
        y: 2
    };

    const p3: Point = {
        x: 15,
        y: -3
    };

    const p4: Point = {
        x: -4,
        y: 5
    };

    it('add two points', () => {
        expect(sgPoint.concat(p1, p2)).toEqual({
            x: 7,
            y: 7
        });
    });

    it('function semigroup', () => {
        const isPositiveX = (p: Point) => p.x >= 0;
        const isNegativeY = (p: Point) => p.y <= 0;
        const checkPoint = sgPred.concat(isPositiveX, isNegativeY);

        expect(checkPoint(p1)).toBe(false);
        expect(checkPoint(p2)).toBe(false);
        expect(checkPoint(p3)).toBe(true);
        expect(checkPoint(p4)).toBe(false);
    });

    it('function or semigroup', () => {
        const sgOrPred: Semigroup<(p: Point) => boolean> = getFunctionSemigroup(semigroupAny)();
        const isPositiveX = (p: Point) => p.x >= 0;
        const isNegativeY = (p: Point) => p.y <= 0;
        const checkPoint = sgOrPred.concat(isPositiveX, isNegativeY);

        expect(checkPoint(p1)).toBe(true);
        expect(checkPoint(p2)).toBe(true);
        expect(checkPoint(p3)).toBe(true);
        expect(checkPoint(p4)).toBe(false);
    });

    it('fold', () => {
        const sum = fold(semigroupSum);
        const prod = fold(semigroupProd);

        expect(sum(0, [1, 2, 3, 4])).toBe(10);
        expect(prod(1, [1, 2, 3, 4])).toBe(24);
    });

    it('Maybe semigroup', () => {
        const addMaybe = getApplySemigroup(semigroupSum);
        const multMaybe = getApplySemigroup(semigroupProd);

        expect(addMaybe.concat(Just(5), Just(11))).toEqual(Just(16));
        expect(addMaybe.concat(Just(5), Nothing)).toEqual(Nothing);
        expect(multMaybe.concat(Just(5), Just(11))).toEqual(Just(55));
        expect(multMaybe.concat(Just(5), Nothing)).toEqual(Nothing);
    });

    it('Either semigroup', () => {
        const allEither = eitherSg<string, boolean>(semigroupAll);
        const fnSgEither = getFunctionSemigroup(allEither)<Point>();
        const ptNot0 = (p: Point) => p.x === 0 ? inl('error in x') : inr(true);
        const ptLess0 = (p: Point) => p.y < 0 ? inr(true) : p.y > 0 ? inl('error in y') : inr(false);
        const testFn = fnSgEither.concat(ptNot0, ptLess0);

        expect(testFn(p1)).toEqual(inl('error in y'));
        expect(testFn(p2)).toEqual(inl('error in y'));
        expect(testFn(p3)).toEqual(inr(true));
        expect(testFn(p4)).toEqual(inl('error in y'));
        expect(testFn({ x: 0, y: -4 })).toEqual(inl('error in x'));
        expect(testFn({ x: -1, y: -1 })).toEqual(inr(true));
        expect(testFn({ x: -1, y: 0 })).toEqual(inr(false));
    });

    it('string semigroup', () => {
        expect(semigroupString.concat('Hello', ' world!')).toBe('Hello world!');
    });

    it('tuple semigroup', () => {
        const s = getTupleSemigroup(semigroupString, semigroupSum, semigroupVoid);
        expect(s.concat(['hello', 5, void 5], ['!', 16, void 18])).toEqual(['hello!', 21, void 0]);
    });

    it('dual semigroup', () => {
        const s = getDualSemigroup(semigroupSum);
        expect(s.concat(5, 21)).toBe(26);
        const s2 = getDualSemigroup(semigroupString);
        expect(s2.concat('hello', 'world')).toBe('worldhello');
    });

    it('last semigroup', () => {
        expect(getLastSemigroup<number>().concat(5, 1)).toBe(1);
        expect(getLastSemigroup<number>().concat(1, 5)).toBe(5);
        expect(getLastSemigroup<string>().concat('hello', 'world')).toBe('world');
    });

    it('first semigroup', () => {
        expect(getFirstSemigroup<number>().concat(5, 1)).toBe(5);
        expect(getFirstSemigroup<number>().concat(1, 5)).toBe(1);
        expect(getFirstSemigroup<string>().concat('hello', 'world')).toBe('hello');
    });
});
