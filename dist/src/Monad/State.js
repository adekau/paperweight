"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Identity_1 = require("./Identity");
var Pipeable_1 = require("./Pipeable");
var StateT_1 = require("./StateT");
;
exports.HKTId = 'State';
var T = StateT_1.getStateM(Identity_1.Identity);
exports.evalState = T.evalState;
exports.execState = T.execState;
exports.get = T.get;
exports.gets = T.gets;
exports.put = T.put;
exports.modify = T.modify;
exports.State = {
    HKT: exports.HKTId,
    of: T.of,
    ap: T.ap,
    map: T.map,
    bind: T.bind
};
exports.StateP = Pipeable_1.pipeable(exports.State);
//# sourceMappingURL=State.js.map