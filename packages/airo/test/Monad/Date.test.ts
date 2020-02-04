import { now, create } from "../../src/Monad/Date";

describe('Date library', () => {
    it('Gets current time', () => {
        const t = now();

        expect(t()).toEqual(Date.now());
    });

    it('Gets a date object', () => {
        const t = create();

        expect(t()).toEqual(new Date());
    })
});
