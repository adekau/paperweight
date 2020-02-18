export function deepCompare() {
    return (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
}
