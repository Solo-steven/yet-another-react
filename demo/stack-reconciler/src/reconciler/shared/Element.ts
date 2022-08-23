export class BaseComponent {
    static isVirtualDOMComponent = true;
    state: any;
    _internalComponentNode: any;
    constructor(props?:PropsType) {
    }
    setState() {
        
    }
    render(): any {

    }
}

export type CSSProperity = {[key: string]: any};
export interface PropsType extends CSSProperity  {
    children: Array<ElementNode>;
}

export type FunctionComponentType = ((props: PropsType) => ElementNode) | (() => ElementNode);
export type ClassComponentType = typeof BaseComponent;
export type HostComponentType = string;

export type ComponentElementNode = {
    type: FunctionComponentType | ClassComponentType | HostComponentType;
    props: PropsType,
};
export type LiteralElementNode = string | number;
export type ElementNode = ComponentElementNode | LiteralElementNode;


export function createElement(
    type: ComponentElementNode['type'], 
    props: ComponentElementNode['props'] = { children: [] },
): ComponentElementNode {
    return { type, props }
}