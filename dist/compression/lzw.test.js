"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lzw_1 = require("./lzw");
describe('LZW', function () {
    it('Compresses and decompresses strings', function () {
        var str = 'testing 123 testing';
        var compressed = lzw_1.LZWCompressor.compress(str);
        var decompressed = lzw_1.LZWCompressor.decompress(compressed);
        expect(decompressed).toBe(str);
    });
    it('Compresses and decompresses JSON', function () {
        var obj = {
            test: '123',
            testing: '123456'
        };
        var compressed = lzw_1.LZWCompressor.compress(obj);
        var decompressed = lzw_1.LZWCompressor.decompress(compressed);
        expect(JSON.stringify(obj)).toBe(decompressed);
    });
    it('Handles bigger JSON', function () {
        var obj = {
            1: 'long string here',
            2: 2,
            3: { nested: 'json here' },
            4: { nested: { on: 'nested' } },
            gonna: 'make make make a really long repetitive repetitive string string here! symbols!@$$^&*(',
            string: true,
            true: false,
            weird: 'test'
        };
        var compressed = lzw_1.LZWCompressor.compress(obj);
        var decompressed = lzw_1.LZWCompressor.decompress(compressed);
        expect(JSON.stringify(obj)).toBe(decompressed);
    });
});
//# sourceMappingURL=lzw.test.js.map