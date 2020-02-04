"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Function_1 = require("./Function");
exports.fold = function (s) { return function (a, as) { return as.reduce(s.concat, a); }; };
exports.getFirstSemigroup = function () { return ({
    concat: Function_1.identity
}); };
exports.getLastSemigroup = function () { return ({
    concat: function (_, y) { return y; }
}); };
exports.getTupleSemigroup = function () {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return ({
        concat: function (x, y) { return semigroups.map(function (s, i) { return s.concat(x[i], y[i]); }); }
    });
};
exports.getDualSemigroup = function (s) { return ({
    concat: function (x, y) { return s.concat(y, x); }
}); };
exports.getFunctionSemigroup = function (s) { return function () { return ({
    concat: function (f, g) { return function (a) { return s.concat(f(a), g(a)); }; }
}); }; };
function getStructSemigroup(semigroups) {
    return {
        concat: function (x, y) {
            var r = {};
            for (var _i = 0, _a = Object.keys(semigroups); _i < _a.length; _i++) {
                var key = _a[_i];
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
}
exports.getStructSemigroup = getStructSemigroup;
;
exports.semigroupAll = {
    concat: function (x, y) { return x && y; }
};
exports.semigroupAny = {
    concat: function (x, y) { return x || y; }
};
exports.semigroupSum = {
    concat: function (x, y) { return x + y; }
};
exports.semigroupProd = {
    concat: function (x, y) { return x * y; }
};
exports.semigroupString = {
    concat: function (x, y) { return x + y; }
};
exports.semigroupVoid = {
    concat: function () { return void 0; }
};
//# sourceMappingURL=Semigroup.js.map