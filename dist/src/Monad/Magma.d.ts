/**
 * A Magma is a pair `(A, -)` in which `A` is a non-empty set and `-` is a binary operator (does not have to be associative)
 * e.g. `-: (x: A, y: A) => A`
 *      `-: (x: A, y: A) => x - y`
 */
export declare type Magma<A> = {
    readonly concat: (x: A, y: A) => A;
};
