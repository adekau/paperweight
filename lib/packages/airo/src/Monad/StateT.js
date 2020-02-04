export function getStateM(M) {
    return {
        of: a => s => M.of([a, s]),
        map: (ma, f) => s => M.map(ma(s), ([a, s1]) => [f(a), s1]),
        ap: (mab, ma) => s => M.bind(mab(s), ([f, s]) => M.map(ma(s), ([a, s]) => [f(a), s])),
        bind: (ma, f) => s => M.bind(ma(s), ([a, s1]) => f(a)(s1)),
        get: () => s => M.of([s, s]),
        gets: f => s => M.of([f(s), s]),
        put: s => () => M.of([undefined, s]),
        modify: f => s => M.of([undefined, f(s)]),
        fromState: sa => s => M.of(sa(s)),
        fromM: ma => s => M.map(ma, a => [a, s]),
        evalState: (ma, s) => M.map(ma(s), ([a]) => a),
        execState: (ma, s) => M.map(ma(s), ([_, s]) => s)
    };
}
;
//# sourceMappingURL=StateT.js.map