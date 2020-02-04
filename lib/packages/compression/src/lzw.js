var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ImplementsStatic } from '@paperweight/utility';
let LZWCompressor = class LZWCompressor {
    static compress(json) {
        if (typeof json === 'object')
            json = JSON.stringify(json);
        const dict = {};
        const result = [];
        let word = '';
        let dictSize = 256;
        for (let i = 0; i < 256; i++)
            dict[String.fromCharCode(i)] = i;
        for (let i = 0, len = json.length; i < len; i++) {
            const curChar = json[i];
            const joinedWord = word + curChar;
            if (dict.hasOwnProperty(joinedWord))
                word = joinedWord;
            else {
                result.push(dict[word]);
                dict[joinedWord] = dictSize++;
                word = curChar;
            }
        }
        if (word !== '')
            result.push(dict[word]);
        return result;
    }
    static decompress(compressed) {
        if (!compressed.length)
            return {};
        const dict = {};
        let word = String.fromCharCode(compressed[0]);
        let result = word;
        let entry = '';
        let dictSize = 256;
        for (let i = 0; i < 256; i++)
            dict[i] = String.fromCharCode(i);
        for (let i = 1, len = compressed.length; i < len; i++) {
            const curNum = compressed[i];
            if (dict[curNum] !== undefined)
                entry = dict[curNum];
            else if (curNum === dictSize)
                entry = word + word[0];
            else
                throw Error('Error in processing.');
            result += entry;
            dict[dictSize++] = word + entry[0];
            word = entry;
        }
        return result;
    }
};
LZWCompressor = __decorate([
    ImplementsStatic()
], LZWCompressor);
export { LZWCompressor };
//# sourceMappingURL=lzw.js.map