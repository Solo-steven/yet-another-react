import { 
    BaseComponent, 
    ElementNode, ComponentElementNode, LiteralElementNode,
} from "@/src/reconciler/shared/Element";
/**
 * ================
 * Component Node's Tags
 * ================
 */
type HostComponentNodeTag = "HostComponent";
type HostTextComponentNodeTag = "HostTextComponent";
type CustomComponentNodeTag = "CustomComponent";

export type ComponentNodeTag = HostComponentNodeTag | HostTextComponentNodeTag | CustomComponentNodeTag;
/**
 * =================
 * Component Node's Type
 * =================
 */
export type HostRootComponent = {
    tag: "HostRootComponent";
    childrenElement: ElementNode | null;
    stateNode: Element | null;
    parent: null;
    renderedChildren: ComponentNode | null;
}
export type HostComponentNode = {
    tag: HostComponentNodeTag;
    element: ComponentElementNode;
    stateNode: Element | null;
    parent: ComponentNode | null;
    renderedChildren: Array<ComponentNode>;
}
export type HostTextComponentNode = {
    tag: HostTextComponentNodeTag,
    element: LiteralElementNode,
    stateNode: Text | null;
    parent: ComponentNode | null;
    renderedChildren: null;
}
export type CustomComponentNode = {
    tag: CustomComponentNodeTag,
    element: ComponentElementNode,
    stateNode: BaseComponent | null,
    pendingState: any;
    parent: ComponentNode | null;
    renderedChildren: ComponentNode | null;
}
export type ComponentNode =  HostRootComponent | HostComponentNode | HostTextComponentNode | CustomComponentNode ;
/**
 * ==========================================
 *          Create a Components Node
 * -----------------------------------------
 *  notes : create a component node only init 
 *  it's tag and it's pointer to user-defined 
 *  element tree.
 * ==========================================
 */
function createHostComponentNode(element:ElementNode ): HostComponentNode {
    if(typeof(element) === "string" || typeof(element) === "number") {
        throw new Error(`[Error]:Create a HostComponentNode, But element is a string `)
    }
    if(typeof(element.type) !== "string") {
        throw new Error(`[Error]: Create a HostComponentNode, But element.type is not string.`);
    }
    return {
        tag: "HostComponent",
        element: element,
        renderedChildren: [],
        parent: null,
        stateNode: null,
    } as HostComponentNode
}
function createCustomComponentNode(element: ElementNode): CustomComponentNode {
    if(typeof(element) === "string" || typeof(element) === "number") {
        throw new Error(``);
    }
    if(typeof(element.type) !== "function") {
        throw new Error(``);
    }
    return {
        tag: "CustomComponent",
        element,
        parent: null,
        renderedChildren: null,
        stateNode: null,
        pendingState: null,
    }as CustomComponentNode
}
function createHostTextComponentNode(element: ElementNode): HostTextComponentNode {
    if(!(typeof(element) === "string" || typeof(element) === "number")) {
        throw new Error(``);
    }
    return {
        tag: "HostTextComponent",
        element,
        stateNode: null,
        renderedChildren: null,
        parent: null,
    } as HostTextComponentNode;
}

export function createHostRootComponentNode(childrenElement: ElementNode | null) {
    return {
        tag: "HostRootComponent",
        childrenElement: childrenElement,
        stateNode: null,
        parent: null,
        renderedChildren: null,
    } as HostRootComponent;
}
export function createComponentNodeFromElementNode (element: ElementNode): ComponentNode {
    if(typeof(element) === "string" || typeof(element) === "number") {
        return createHostTextComponentNode(element);
    }
    if(typeof(element.type) === "string") {
        return createHostComponentNode(element);
    }
    return createCustomComponentNode(element);
}
/**
 * ==========================================
 *          Util function
 * -----------------------------------------
 *  some helper.
 * ==========================================
 */

export function findHostParentInAncestor(node: ComponentNode): HostComponentNode | null {
    let current: ComponentNode | null = node.parent;
    while(current) {
        if(current.stateNode instanceof Element) {
            return current as HostComponentNode;
        }
        current = current.parent;
    }
    return null;
}

export function findHostRootOfTree(root: ComponentNode) {
    while(root) {
        if(root.tag === "HostComponent") {
            return root;
        }
        if(root.tag === "HostTextComponent") {
            return root;
        }
        if(root.renderedChildren === null) 
            return null;
        root = root.renderedChildren;
    }
    return null;
}