export type Action<S, P = never> = [P] extends [never]
    ? (state: S) => S
    : (state: S, payload: P) => S;
