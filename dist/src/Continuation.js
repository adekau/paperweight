"use strict";
/** some definitions:
 *  C[F] = continuation monad. F in this case is a function.
 *  lift/return: F -> C[F]
 *  flatten/join: C[F] -> F
 *  bind (flatMap): C[F] -> (F -> C[F2]) -> C[F2]
 *  map: C[F] -> (F -> F2) -> C[F2]
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Continuation Monad
 * @param fn
 */
var Cont = /** @class */ (function () {
    // Lift: F -> C[F]
    function Cont(fn) {
        this.fn = fn;
    }
    // Unit: A -> C[F(A)]
    Cont.of = function (val) {
        return new Cont(function (resolve) { return resolve(val); });
    };
    // Identity: T -> T
    Cont.id = function () {
        return function (result) { return result; };
    };
    // Bind: C[F] -> (F -> C[F2]) -> C[F2]
    Cont.prototype.bind = function (f) {
        var _this = this;
        return new Cont(function (resolve) {
            return _this.fn(function (result) {
                return f(result).fn(function (result2) {
                    return resolve(result2);
                });
            });
        });
    };
    // Eval: C[F] -> (T -> U) -> U
    Cont.prototype.run = function (f) {
        return this.fn(f);
    };
    // map: C[F] -> (F -> F2) -> C[F2]
    Cont.prototype.map = function (f) {
        return this.bind(function (result) { return Cont.of(f(result)); });
    };
    return Cont;
}());
exports.Cont = Cont;
//# sourceMappingURL=Continuation.js.map