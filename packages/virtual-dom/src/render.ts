import { VirtualNode, DOMNode } from "./type";

export const createElement = (
    type: string, props: {[key: string]: any}, children: Array<VirtualNode>
) => {
    return {
        type, props, children
    }
};

export const transform = (vdom: VirtualNode) => {
    if(typeof vdom === 'string' ||typeof vdom === 'number') {
        const node = document.createTextNode(String(vdom));
        return node;
    }
    const node = document.createElement(vdom.type );
    for(const [key, value] of Object.entries(vdom.props)) {
            node.setAttribute(key, value)
    }
    for(const child of vdom.children) {
        node.appendChild(transform(child));
    }
    return node;
}

export const mount = (dom: DOMNode, replacedDOM: Element) => {
    replacedDOM.appendChild(dom);
}
