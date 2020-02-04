import { IO } from "./IO";

export const log: <T>(msg: T) => IO<void> = msg => () => console.log(msg);
