import { apFirst, apSecond, Just, Maybe, Nothing, fold } from '../../src/Monad/Maybe';

describe('Maybe Monad', () => {
    it('just', () => {
        expect(Maybe.of(55)).toEqual(Just(55));
    });

    it('none', () => {
        expect(Maybe.bind(Maybe.of(55), _ => Nothing)).toEqual(Nothing);
    });

    it('bind', () => {
        expect(Maybe.bind(Maybe.of(55), result => Just(result + 5))).toEqual(Just(60));
    });

    it('map', () => {
        expect(Maybe.map(Maybe.of(55), result => result + 5)).toEqual(Just(60));
    });

    it('apply', () => {
        expect(Maybe.ap(Just((a: boolean) => !a), Just(false))).toEqual(Just(true));
    });

    it('pipeable fn', () => {
        expect(
            apFirst(Just(5))(Just('hi'))
        ).toEqual(Just('hi'));
        expect(
            apSecond(Just(5))(Just('hi'))
        ).toEqual(Just(5));
    });

    it('fold', () => {
        const div = (num1: number, num2: number) => num2 === 0 ? Nothing : Just(num1 / num2);
        const fld = fold(() => 0, (v) => v);

        expect(fld(div(15, 0))).toBe(0);
        expect(fld(div(15, 3))).toBe(5);
        expect(fld(div(-15, 3))).toBe(-5);
        expect(fld(div(NaN, 0))).toBe(0);
    });
});
