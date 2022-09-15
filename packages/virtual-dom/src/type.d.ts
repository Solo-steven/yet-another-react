export type VirtualNode = {
    type: string;
    props: {[key: string]: any},
    children: Array<VirtualNode>;
} | string | number;

export type DOMNode = HTMLElement | Text;