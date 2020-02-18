import { IStaticCompressor } from 'projects/contracts/src/public-api';
import { ImplementsStatic } from 'projects/utility/src/public-api';

@ImplementsStatic<IStaticCompressor<object | string, number[]>>()
export class LZWCompressor {
    public static compress(json: object | string): number[] {
        if (typeof json === 'object')
            json = JSON.stringify(json);

        const dict: { [word: string]: number } = {};
        const result: number[] = [];
        let word = '';
        let dictSize: number = 256;

        for (let i: number = 0; i < 256; i++)
            dict[String.fromCharCode(i)] = i;

        for (let i: number = 0, len: number = json.length; i < len; i++) {
            const curChar: string = json[i];
            const joinedWord: string = word + curChar;

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

    public static decompress(compressed: number[]): string | object {
        if (!compressed.length)
            return {};

        const dict: { [k: number]: string } = {};
        let word: string = String.fromCharCode(compressed[0]);
        let result: string = word;
        let entry: string = '';
        let dictSize: number = 256;

        for (let i: number = 0; i < 256; i++)
            dict[i] = String.fromCharCode(i);

        for (let i: number = 1, len: number = compressed.length; i < len; i++) {
            const curNum: number = compressed[i];

            if (dict[curNum] !== undefined)
                entry = dict[curNum];
            else
                if (curNum === dictSize)
                    entry = word + word[0];
                else
                    throw Error('Error in processing.');

            result += entry;
            dict[dictSize++] = word + entry[0];
            word = entry;
        }

        return result;
    }
}
