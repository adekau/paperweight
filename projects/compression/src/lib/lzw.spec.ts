import { LZWCompressor } from './lzw';

describe('LZW', () => {
    it('Compresses and decompresses strings', () => {
        const str: string = 'testing 123 testing';
        const compressed = LZWCompressor.compress(str);
        const decompressed = LZWCompressor.decompress(compressed);
        expect(decompressed).toBe(str);
    });

    it('Compresses and decompresses JSON', () => {
        const obj = {
            test: '123',
            testing: '123456'
        };
        const compressed = LZWCompressor.compress(obj);
        const decompressed = LZWCompressor.decompress(compressed);
        expect(JSON.stringify(obj)).toBe(decompressed as string);
    });

    it('Handles bigger JSON', () => {
        const obj = {
            1: 'long string here',
            2: 2,
            3: { nested: 'json here' },
            4: { nested: { on: 'nested' } },
            gonna: 'make make make a really long repetitive repetitive string string here! symbols!@$$^&*(',
            string: true,
            true: false,
            weird: 'test'
        };
        const compressed = LZWCompressor.compress(obj);
        const decompressed = LZWCompressor.decompress(compressed);
        expect(JSON.stringify(obj)).toBe(decompressed as string);
    });
})
