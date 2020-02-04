"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
function now() {
    return IO_1.IO.of(Date.now());
}
exports.now = now;
function create() {
    return IO_1.IO.of(new Date());
}
exports.create = create;
//# sourceMappingURL=Date.js.map