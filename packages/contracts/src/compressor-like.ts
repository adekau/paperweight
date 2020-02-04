import { Instantiable } from '@paperweight/utility';

export interface ICompressorLike { }

export interface IStaticCompressor<T, U> extends Instantiable<ICompressorLike> {
    compress(data: T): U;
    decompress(compressed: U): T;
}
