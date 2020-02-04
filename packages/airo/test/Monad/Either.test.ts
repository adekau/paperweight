import { Either, fold, inl, inr } from '../../src/Monad/Either';

const badVal = 'Bad value';
const falsyIsError = <T extends unknown>(val: T): Either<string, T> =>
    !!val === true ? inr<string, T>(val) : inl<string, T>(badVal);

describe('Either Monad', () => {
    it('left value', () => {
        expect(falsyIsError(false)).toEqual(inl(badVal));
        expect(falsyIsError(0)).toEqual(inl(badVal));
        expect(falsyIsError('')).toEqual(inl(badVal));
        expect(falsyIsError(undefined)).toEqual(inl(badVal));
        expect(falsyIsError(null)).toEqual(inl(badVal));
        expect(falsyIsError(void 0)).toEqual(inl(badVal));
    });

    it('right value', () => {
        expect(falsyIsError(15)).toEqual(inr(15));
        expect(falsyIsError('hello')).toEqual(inr('hello'));
        expect(falsyIsError(true)).toEqual(inr(true));
        expect(falsyIsError({})).toEqual(inr({}));
    });

    it('maps a value', () => {
        const newVal = Either.map(falsyIsError(5), x => x * 2);
        expect(newVal).toEqual(inr(10));
    });

    it('applies a function', () => {
        const fn = inr((x: number) => x * 2);
        const result = Either.ap(fn, inr(16));
        expect(result).toEqual(inr(32));
    });

    it('returns left if fn is left', () => {
        const fn = inl('no fn here');
        const result = Either.ap(fn, inr(16));
        expect(result).toEqual(inl('no fn here'));
    });

    it('returns left if "a" is left', () => {
        const fn = inr((x: number) => x * 2);
        const result = Either.ap(fn, inl('no val here'));
        expect(result).toEqual(inl('no val here'));
    });

    it('constructs', () => {
        expect(Either.of('hello')).toEqual(inr('hello'));
    });

    it('can be chained', () => {
        const first = Either.of('hi');
        expect(Either.bind(first, a => inr(a + ' world'))).toEqual(inr('hi world'));
    });

    it('is foldable', () => {
        const first = Either.of<string, number>(15);
        const result = fold<string, number, boolean>(_ => false, x => x > 5 ? true : false)(first);
        expect(result).toBe(true);
    });
});
