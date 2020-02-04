import { Constructor } from "./types";

export const instanceOfAny = (
  obj: unknown,
  instances: Constructor[]
): boolean => instances.some(c => obj instanceof c);