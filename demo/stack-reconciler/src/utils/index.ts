// For debug. fork a new object to print out.
export function deepCopy(object: any) {
    if(typeof(object) !== "object" || object === null) {
        return object;
    }
    let newObj: any = {};
    for(const [key, value] of Object.entries(object)) {
        newObj[key] = deepCopy(value);
    }
    return newObj;
}