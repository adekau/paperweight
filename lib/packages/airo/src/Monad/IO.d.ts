import { Monad1 } from './Monad';
declare module './HKT' {
    interface HKTToKind<A> {
        IO: IO<A>;
    }
}
export declare type IO<A> = () => A;
export declare const HKTId = "IO";
export declare type HKTId = typeof HKTId;
export declare const IO: Monad1<HKTId>;
export declare const ap: <A, B>(fa: IO<A>) => (fab: IO<(a: A) => B>) => IO<B>, apFirst: <B>(fb: IO<B>) => <A>(fa: IO<A>) => IO<A>, apSecond: <B>(fb: IO<B>) => <A>(fa: IO<A>) => IO<B>, bind: <A, B>(f: (a: A) => IO<B>) => (fa: IO<A>) => IO<B>, bindFirst: <A, B>(f: (a: A) => IO<B>) => (fa: IO<A>) => IO<A>, flatten: <A>(mma: IO<IO<A>>) => IO<A>, map: <A, B>(f: (a: A) => B) => (fa: IO<A>) => IO<B>, of: <A>() => (a: A) => IO<A>;
//# sourceMappingURL=IO.d.ts.map