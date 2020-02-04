"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Date_1 = require("../../src/Monad/Date");
describe('Date library', function () {
    it('Gets current time', function () {
        var t = Date_1.now();
        expect(t()).toEqual(Date.now());
    });
    it('Gets a date object', function () {
        var t = Date_1.create();
        expect(t()).toEqual(new Date());
    });
});
//# sourceMappingURL=Date.test.js.map