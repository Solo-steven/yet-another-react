import { 
    ElementNode, ComponentElementNode, LiteralElementNode,
    FunctionComponentType,
    ClassComponentType,
} from "@/src/reconciler/shared/Element";
import { 
    ComponentNode, HostComponentNode,
    createComponentNodeFromElementNode,
    findHostParentInAncestor,
    HostTextComponentNode,
    CustomComponentNode,
} from "@/src/reconciler/shared/Component";
import { createInstance, createTextInstance, appendChild } from "@/src/renderer/HostConfig";
/**
 * ==========================================
 *          Mount a Components Node
 * -----------------------------------------
 *  create component's stateNode and children
 *  by component's element.
 * ==========================================
 */
function renderHostComponent(
    componentNode: HostComponentNode
): HostComponentNode {
    const element = componentNode.element;
    const elementChild = element.props.children;

    // Create StateNode (Host Instance), and append to it's exist parent.
    // (because of dfs traversal order, parent already exist when visit this node).
    componentNode.stateNode = createInstance(element.type as string, element.props);
    const parent = findHostParentInAncestor(componentNode);
    if(parent !== null)  {
        const parentDOM = parent.stateNode;
        appendChild(parentDOM, componentNode.stateNode);
    }

    // Recursively mount children node and append to parent component-node
    const renderedChildren = componentNode.renderedChildren as Array<ComponentNode>;
    for(const childElement of elementChild) {
        const childComponent = createComponentNodeFromElementNode(childElement);
        childComponent.parent = componentNode;
        renderedChildren.push(renderComponentNode( childComponent));
    }
    return componentNode;
}

function renderHostTextComponent(
    componentNode: HostTextComponentNode,
): HostTextComponentNode {
    const element = componentNode.element as LiteralElementNode;

    // Create StateNode (Host Instance), and append to it's exist parent.
    // (because of dfs traversal order, parent already exist when visit this node).
    componentNode.stateNode = createTextInstance(element);
    const parent = findHostParentInAncestor(componentNode);
    if(parent !== null)  {
        const parentDOM = parent.stateNode;
        appendChild(parentDOM, componentNode.stateNode);
    }
    return componentNode;
}

function renderCustomComponentNode(
    componentNode: CustomComponentNode
): CustomComponentNode {
    const element = componentNode.element as ComponentElementNode;
    const eleType = element.type ;
    const props = element.props;

    // Create Child Element by calling method or function.
    // Mount instance to stateNode if componentNode is class-component.
    let elementChild: ElementNode | null = null;
    if((eleType as ClassComponentType).isVirtualDOMComponent) {
        const _eleType =  eleType as ClassComponentType;
        componentNode.stateNode = new _eleType(props);
        componentNode.stateNode._internalComponentNode = componentNode;
        elementChild = componentNode.stateNode.render() as ElementNode;
    }else {
        const _eleType = eleType as FunctionComponentType;
        componentNode.stateNode = null;
        elementChild = _eleType(props) as ElementNode;
    }
    if(elementChild === null) {
        return componentNode;
    }
    const componentChild = createComponentNodeFromElementNode(elementChild);
    componentChild.parent = componentNode;
    // Recursively Call to mount child.
    componentNode.renderedChildren = renderComponentNode(componentChild);
    return componentNode;
}

export function renderComponentNode(
    componentNode: ComponentNode, 
): ComponentNode {
    if(componentNode.tag === "HostComponent") {
        return renderHostComponent(componentNode);
    }
    if(componentNode.tag === "HostTextComponent") {
        return renderHostTextComponent(componentNode);
    }
    if(componentNode.tag === "CustomComponent") {
        return renderCustomComponentNode(componentNode);
    }
    throw new Error(``);
}
