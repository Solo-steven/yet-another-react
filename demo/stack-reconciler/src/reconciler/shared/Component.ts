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
export type HostComponentNode = {
    tag: HostComponentNodeTag;
    element: ComponentElementNode;
    stateNode: Element | null;
    renderedChildren: Array<ComponentNode>;
}

export type HostTextComponentNode = {
    tag: HostTextComponentNodeTag,
    element: LiteralElementNode,
    stateNode: Text | null;
    renderedChildren: null;
}

export type CustomComponentNode = {
    tag: CustomComponentNodeTag,
    element: ComponentElementNode,
    stateNode: BaseComponent | null,
    pendingState: any;
    renderedChildren: ComponentNode | null;
}

export type ComponentNode = HostComponentNode | HostTextComponentNode | CustomComponentNode ;

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
    } as HostTextComponentNode;
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
 *  1.`findCloseDOM`: find a near parent in a 
 *  root-to-parent array.
 *  2. `getHostNode`: find host-root in a
 *  component-node tree. 
 * ==========================================
 */
export function findClosestDOM(paths: Array<ComponentNode>): Element | null {
    for(let i = paths.length - 1 ; i >= 0 ; --i) {
        const componentNode = paths[i];
        if(componentNode.stateNode instanceof Element) {
            return componentNode.stateNode;
        }
    }
    return null;
}

export function getHostNode(componentNode: ComponentNode | null): Element | Text | null {
    if(componentNode === null) {
        return null;
    }
    if(componentNode.tag === "HostTextComponent") {
        return componentNode.stateNode as Text;
    }
    if(componentNode.tag === "HostComponent") {
        return componentNode.stateNode as Element;
    }
    return getHostNode(componentNode.renderedChildren);
};
