import { IO } from "./IO";

export function now(): IO<number> {
    return IO.of(Date.now());
}

export function create(): IO<Date> {
    return IO.of(new Date());
}
