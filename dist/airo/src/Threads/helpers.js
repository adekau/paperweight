"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a function to a url blob.
 * @param func Function to convert to a url blob. This is used for spawning web workers.
 * @returns string
 */
exports.fnToURL = function (func) {
    var strFn = func.toString();
    var fnBody = strFn
        .substring(strFn.indexOf('{') + 1, strFn.lastIndexOf('}'));
    var blob = new Blob([fnBody], {
        type: 'text/javascript'
    });
    return URL.createObjectURL(blob);
};
/**
 * A function that takes no arguments and does nothing.
 * @returns void
 */
exports.noOp = function () { };
//# sourceMappingURL=helpers.js.map