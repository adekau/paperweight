export function deepCopy<T extends (Date | Array<unknown> | Object)>(obj: T): T {
    if (obj === null || typeof obj !== 'object')
        return obj;

    if (obj instanceof Date)
        return <T>new Date(obj.getTime());

    if (Array.isArray(obj)) {
        const newArr = [];
        for (let i = 0; i < obj.length; i++)
            newArr[i] = deepCopy(obj[i]);
        return <T>newArr;
    }

    if (obj instanceof Object) {
        const newObj: any = {};
        for (const attr in obj)
            if (obj.hasOwnProperty(attr)) newObj[attr] = deepCopy(obj[attr]);
        return <T>newObj;
    }

    throw new Error(`Unable to deep copy object ${Object.prototype.toString.call(obj)}`);
}
