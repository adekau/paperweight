export function getReaderM(m) {
    return {
        map: (ma, f) => r => m.map(ma(r), f),
        of: (a) => () => m.of(a),
        ap: (mab, ma) => r => m.ap(mab(r), ma(r)),
        bind: (ma, f) => r => m.bind(ma(r), a => f(a)(r)),
        ask: () => m.of,
        asks: f => r => m.map(m.of(r), f),
        local: (ma, f) => q => ma(f(q)),
        fromReader: ma => r => m.of(ma(r)),
        fromM: ma => () => ma
    };
}
;
//# sourceMappingURL=ReaderT.js.map