"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category_1 = require("./Category");
var Func_1 = require("./Func");
var Prod_1 = require("./Prod");
function createState(runFunc) {
    return ({
        run: runFunc,
        then: function (state) {
            return stJoin(this.map(Func_1.func(state)));
        },
        ignore: function () {
            return this.ignoreWith(Func_1.apply(Category_1.unit(), void 0));
        },
        ignoreWith: function (val) {
            return this.map(Category_1.constant(val));
        },
        map: function (f) {
            return createState(f
                .timesMap(Category_1.identity())
                .after(this.run));
        }
    });
}
exports.createState = createState;
;
function stRun() {
    return Func_1.func(function (p) { return p.run; });
}
exports.stRun = stRun;
;
function stJoin(f) {
    var g = Prod_1.fst()
        .then(stRun())
        .times(Prod_1.snd())
        .then(Func_1.applyPair());
    var h = stRun()
        .timesMap(Category_1.identity())
        .then(Func_1.applyPair())
        .then(g);
    return createState(Func_1.apply(Func_1.curry(h), f));
}
exports.stJoin = stJoin;
;
//# sourceMappingURL=State.js.map