export type AnyFunc = (...args: any[]) => any;

export function identity<A>(a: A) {
    return a;
};
