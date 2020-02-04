import { getReaderM } from "../../src/Monad/ReaderT";
import { Either, inr, inl } from "../../src/Monad/Either";
import { Reader } from "../../src/Monad/Reader";

describe('ReaderT', () => {
    const readerEither = getReaderM(Either);
    const e: (x: number) => Either<Error, string> = x => x > 0 ? inr(`value is ${x}`) : inl(Error(`Can't be <= 0`));
    const eR = (x: number) => x > 0 ? `value is ${x}` : Error(`Can't be <= 0`);

    it('gets reader for other monad', () => {
        const re1 = readerEither.fromM(e(15));
        const re2 = readerEither.fromM(e(0));
        const re3 = readerEither.fromReader(eR);

        expect(re1('')).toEqual(inr(`value is 15`));
        expect(re2('')).toEqual(inl(Error(`Can't be <= 0`)));
        // Both will be right since it uses Either.of
        expect(re3(5)).toEqual(inr(`value is 5`));
        expect(re3(0)).toEqual(inr(Error(`Can't be <= 0`)));
    });

    it('maps', () => {
        const re = readerEither.fromReader(Reader.of('hi'));
        const r = readerEither.map(re, str => str + '!');

        expect(r('anything')).toEqual(inr(`hi!`));
    });
});
