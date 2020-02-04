import { Instantiable } from '../utility/instantiable';
export interface ICompressorLike {
}
export interface IStaticCompressor<T, U> extends Instantiable<ICompressorLike> {
    compress(data: T): U;
    decompress(compressed: U): T;
}
