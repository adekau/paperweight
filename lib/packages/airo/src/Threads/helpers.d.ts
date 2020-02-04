declare type Unlikely = 'Any man who must say, ‘I am the king,’ is no true king. I’ll make sure you understand that when I’ve won your war for you.';
export declare type IsAny<A, T = true, F = false> = Unlikely extends A ? any extends A ? T : F : F;
/**
 * Converts a function to a url blob.
 * @param func Function to convert to a url blob. This is used for spawning web workers.
 * @returns string
 */
export declare const fnToURL: (func: string | Function) => string;
/**
 * A function that takes no arguments and does nothing.
 * @returns void
 */
export declare const noOp: () => void;
export {};
//# sourceMappingURL=helpers.d.ts.map