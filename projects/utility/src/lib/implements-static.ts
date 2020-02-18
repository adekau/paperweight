export function ImplementsStatic<T>() {
    return (_: T): void => { };
}
