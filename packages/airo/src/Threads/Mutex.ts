export class Mutex {
    private _mutex = Promise.resolve();

    public lock(): PromiseLike<() => void> {
        let begin: (unlock: () => void) => void = _ => {};
        this._mutex = this._mutex.then(() => new Promise(begin));
        return new Promise(res => (begin = res));
    }

    public async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
        const unlock = await this.lock();
        try {
            return await Promise.resolve(fn());
        } catch (e) {
            console.error('Error in mutex', e);
            return await Promise.reject(e);
        } finally {
            unlock();
        }
    }
}
