"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Semigroup_1 = require("./Semigroup");
exports.monoidAll = {
    empty: true,
    concat: Semigroup_1.semigroupAll.concat
};
exports.monoidAny = {
    empty: false,
    concat: Semigroup_1.semigroupAny.concat
};
exports.monoidSum = {
    empty: 0,
    concat: Semigroup_1.semigroupSum.concat
};
exports.monoidProd = {
    empty: 1,
    concat: Semigroup_1.semigroupProd.concat
};
exports.monoidString = {
    empty: '',
    concat: Semigroup_1.semigroupString.concat
};
exports.monoidVoid = {
    empty: void 0,
    concat: Semigroup_1.semigroupVoid.concat
};
exports.fold = function (m) { return function (as) {
    var foldSemigroupM = Semigroup_1.fold(m);
    return foldSemigroupM(m.empty, as);
}; };
//# sourceMappingURL=Monoid.js.map