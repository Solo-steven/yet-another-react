import { CSSProperity } from "@/src/reconciler/shared/Element";

export function createInstance(type: string, props: CSSProperity ): Element {
    const domElement = document.createElement(type);
    for(const [key, value] of Object.entries(props)) {
        if(key !== "children")
            domElement.setAttribute(key, value);
    }
    return domElement;
}
export function createTextInstance(type: string | number): Text {
    if(typeof(type) === "number") type = String(type);
    return document.createTextNode(type);
}
export function appendChild(parent: Element| null, child: Element | Text ): void {
    if(parent !== null) {
        parent.append(child);
    }
}
export function replaceChild(parent: Element | null, oldChild: Element | Text,  newChild: Element| Text): void {
    if(parent === null) {
        throw new Error(``);
    }
    parent.replaceChild(newChild, oldChild);
}
export function replaceNode(node: Element, newNode: Element | Text) {
    node.replaceWith(newNode);
}
export function updateTextnstance(textInstance: Text, newContent: string | number): void {
    newContent = typeof(newContent) === "string" ? newContent : String(newContent);
    textInstance.nodeValue = newContent;
}
export function updateInstance(instance: Element, props: CSSProperity): void {
    for(const [key, value] of Object.entries(props)) {
        if(key !== "children")
            instance.setAttribute(key, value);
    }
}