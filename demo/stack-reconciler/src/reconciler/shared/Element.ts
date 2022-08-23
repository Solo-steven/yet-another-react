export class BaseComponent {
    static isVirtualDOMComponent = true;
    state: any;
    props: { [key: string]: any};
    _internalComponentNode: any;
    constructor(props:{ [key: string]: any} = {}) {
        this.props = props;
    }
    render(): ElementNode | null {
        return null;
    }
}
export type CSSProperity = {[key: string]: any};
export interface PropsType extends CSSProperity  {
    children: Array<ElementNode>;
}

export type FunctionComponentType = ((props: {[key: string]: any}) => ElementNode | null) | (() => ElementNode | null);
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