let sideEffects: Array<any> = [];

export function addEffect(effect: Function) {
    sideEffects.push(effect);
}

export function commitEffect() {
    sideEffects.forEach(effect => effect());
    sideEffects = [];
}
