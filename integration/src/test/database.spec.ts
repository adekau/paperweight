import { Database } from '../../../database/database';

describe('Database', () => {
    it('Should wait to be connected', async () => {
        const db = new Database('testdb', 1);
        await db.connect();

        expect((db as any)._state.db).toBeDefined();
    });
});
