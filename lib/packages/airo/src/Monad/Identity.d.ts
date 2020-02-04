import { Monad1 } from './Monad';
declare module './HKT' {
    interface HKTToKind<A> {
        Identity: Identity<A>;
    }
}
export declare const HKTId = "Identity";
export declare type HKTId = typeof HKTId;
export declare type Identity<A> = A;
export declare const Identity: Monad1<HKTId>;
export declare const ap: <A, B>(fa: A) => (fab: (a: A) => B) => B, apFirst: <B>(fb: B) => <A>(fa: A) => A, apSecond: <B>(fb: B) => <A>(fa: A) => B, bind: <A, B>(f: (a: A) => B) => (fa: A) => B, bindFirst: <A, B>(f: (a: A) => B) => (fa: A) => A, map: <A, B>(f: (a: A) => B) => (fa: A) => B, of: <A>() => (a: A) => A;
//# sourceMappingURL=Identity.d.ts.map