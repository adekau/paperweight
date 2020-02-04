type Unlikely = 'Any man who must say, ‘I am the king,’ is no true king. I’ll make sure you understand that when I’ve won your war for you.';
export type IsAny<A, T = true, F = false> = Unlikely extends A
    ? any extends A
    ? T
    : F
    : F

/**
 * Converts a function to a url blob.
 * @param func Function to convert to a url blob. This is used for spawning web workers.
 * @returns string
 */
export const fnToURL = (func: Function | string): string => {
    const strFn: string = func.toString();
    const fnBody: string = strFn
        .substring(
            strFn.indexOf('{') + 1,
            strFn.lastIndexOf('}')
        );

    const blob = new Blob(
        [fnBody], {
        type: 'text/javascript'
    });

    return URL.createObjectURL(blob);
}

/**
 * A function that takes no arguments and does nothing.
 * @returns void
 */
export const noOp = (): void => { };
