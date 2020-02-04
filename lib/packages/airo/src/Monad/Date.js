import { IO } from "./IO";
export function now() {
    return IO.of(Date.now());
}
export function create() {
    return IO.of(new Date());
}
//# sourceMappingURL=Date.js.map