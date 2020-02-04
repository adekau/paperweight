/**
 * Converts a function to a url blob.
 * @param func Function to convert to a url blob. This is used for spawning web workers.
 * @returns string
 */
export const fnToURL = (func) => {
    const strFn = func.toString();
    const fnBody = strFn
        .substring(strFn.indexOf('{') + 1, strFn.lastIndexOf('}'));
    const blob = new Blob([fnBody], {
        type: 'text/javascript'
    });
    return URL.createObjectURL(blob);
};
/**
 * A function that takes no arguments and does nothing.
 * @returns void
 */
export const noOp = () => { };
//# sourceMappingURL=helpers.js.map