import { 
    BaseComponent,
    ElementNode, ComponentElementNode, LiteralElementNode,
    FunctionComponentType,
    ClassComponentType,
} from "@/src/reconciler/shared/Element";
import { 
    ComponentNode,
    createComponentNodeFromElementNode,
    findClosestDOM
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
    componentNode: ComponentNode,
    paths: Array<ComponentNode> = []
): ComponentNode {
    const element = componentNode.element as ComponentElementNode;
    const elementChild = element.props.children;

    // Create StateNode (Host Instance), and append to it's exist parent.
    // (because of dfs traversal order, parent already exist when visit this node).
    componentNode.stateNode = createInstance(element.type as string, element.props);
    const parentDOM = findClosestDOM(paths);
    appendChild(parentDOM, componentNode.stateNode);

    // Recursively mount children node and append to parent component-node
    const renderedChildren = componentNode.renderedChildren as Array<ComponentNode>;
    paths.push(componentNode);
    for(const childElement of elementChild) {
        renderedChildren.push(
            renderComponentNode(
                createComponentNodeFromElementNode(childElement), 
                paths
            )
        );
    }
    paths.pop();
    return componentNode;
}

function renderHostTextComponent(
    componentNode: ComponentNode,
    paths: Array<ComponentNode> = []
): ComponentNode {
    const element = componentNode.element as LiteralElementNode;

    // Create StateNode (Host Instance), and append to it's exist parent.
    // (because of dfs traversal order, parent already exist when visit this node).
    componentNode.stateNode = createTextInstance(element);
    const parentDOM = findClosestDOM(paths);
    appendChild(parentDOM, componentNode.stateNode);
    return componentNode;
}

function renderCustomComponentNode(
    componentNode: ComponentNode, 
    paths: Array<ComponentNode> = []
): ComponentNode {
    const element = componentNode.element as ComponentElementNode;
    const eleType = element.type ;
    const props = element.props;

    // Create Child Element by calling method or function.
    // Mount instance to stateNode if componentNode is class-component.
    let elementChild: ElementNode | null = null;
    let componentChild: ComponentNode;
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
    componentChild = createComponentNodeFromElementNode(elementChild);

    // Recursively Call to mount child.
    paths.push(componentNode);
    componentNode.renderedChildren = renderComponentNode(componentChild, paths);
    paths.pop();
    return componentNode;
}

export function renderComponentNode(
    componentNode: ComponentNode, 
    paths: Array<ComponentNode> = []
): ComponentNode {
    if(componentNode.tag === "HostComponent") {
        return renderHostComponent(componentNode, paths);
    }
    if(componentNode.tag === "HostTextComponent") {
        return renderHostTextComponent(componentNode, paths);
    }
    if(componentNode.tag === "CustomComponent") {
        return renderCustomComponentNode(componentNode, paths);
    }
    throw new Error(``);
}
