import { Database } from '@paperweight/database';

describe('Database', () => {
    it('Should wait to be connected', async () => {
        const db = new Database('testdb', 1);
        await db.connect();

    });
});
