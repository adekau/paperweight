import { Action } from './Action';

export type KnownKeys<T> = {
    [K in keyof T]: string extends K
        ? never
        : number extends K
            ? never
            : K;
} extends { [_ in keyof T]: infer U }
    ? ({} extends U
        ? never
        : U)
    : never;

export type SecondParamOrEmpty<P> = P extends [any, any] ? [P[1]] : [];

export type PayloadType<A extends Action<unknown, unknown>> = A extends Action<unknown, infer P> ? P : never;
