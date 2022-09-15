import { 
    ElementNode,
    ClassComponentType, FunctionComponentType,
    BaseComponent,
} from "@/src/reconciler/shared/Element";
import {
    ComponentNode, 
    CustomComponentNode, 
    HostComponentNode, HostTextComponentNode, 
    createComponentNodeFromElementNode,
    findHostParentInAncestor, findHostRootOfTree, HostRootComponent,
} from "@/src/reconciler/shared/Component";
import { renderComponentNode  } from "@/src/reconciler/mount";
import { addEffect } from "@/src/reconciler/commit";
import {
    appendChild, replaceNode, removeNode,
    updateInstance, updateTextnstance
} from "@/src/renderer/HostConfig";
/**
 * ==========================================
 *          Reconciler a Components.
 * -----------------------------------------
 *  workInProgress pointer to a component with
 *  new element.
 *  current pointer to a component with current
 *  UI's component node.
 *  reconciler function is use for reconciler workInProgress
 *  component's stateNode and renderedChildren by new
 *  element and current's component Node.
 *   1. Resume stateNode ?
 *   2. Create children Component-Node.
 *   3. continue 
 * ==========================================
 */
function createNewSubTree(workInProgress: ComponentNode) {
    renderComponentNode(workInProgress);
    addEffect(() => {
        // perform side-effect to mount new component-tree to it's host parent.
        const parent = findHostParentInAncestor(workInProgress);
        const parentDOM = parent ? parent.stateNode : null;
        const newChild = workInProgress.stateNode as Text | Element;
        appendChild(parentDOM, newChild);
    });
    return workInProgress;
}
function replaceOldSubTree(current: ComponentNode, workInProgress: ComponentNode) {
    renderComponentNode(workInProgress);
    addEffect(() => {
        // perform side-effect to replace last compoent-tree's host root.
        const oldComponentRoot = findHostRootOfTree(current);
        const oldChild = oldComponentRoot?.stateNode;
        const newChild = workInProgress.stateNode as Text;
        replaceNode(oldChild as Element, newChild);
    });
    return workInProgress;
}

function reconcilerHostTextComponentNode(
    current: HostTextComponentNode,
    workInProgress: HostTextComponentNode,
): ComponentNode {
    // Tag is same. because text instance don't need to  replace if next node
    // remind text instance. we can always resume text node in this case.
    // Case 1 : type is same. stop resurion.
    // Case 2 : type is not same, reconciler TextInstance.
    workInProgress.stateNode = current.stateNode;
    const preElement = current.element;
    const nexElement = workInProgress.element;
    if(preElement !== nexElement) {
        addEffect(() => {
            updateTextnstance(workInProgress.stateNode as Text, nexElement);
        })
    }
    return workInProgress;
}
function reconcilerHostComponentNode(
    current: HostComponentNode ,
    workInProgress: HostComponentNode,
): ComponentNode {
    // Tag is same. divide by if element type is same.
    // Case 1 : if is not same element.type, we need to mount new componentNode, and add side-effect.
    // Case 2 : if is same element type. we need to resume old componentNode's host node, and update it.
    // than contine recursively create children and delete children if necessary.
    const preElementType = current.element.type as String;
    const nextElementType = workInProgress.element.type as String;
    const nextChildrenElement  = workInProgress.element.props.children;
    if(preElementType !== nextElementType) {
        return replaceOldSubTree(current, workInProgress);
    }
    // Update component Node.
    workInProgress.stateNode = current.stateNode;
    workInProgress.renderedChildren = nextChildrenElement.map(child =>  {
        const componentChild = createComponentNodeFromElementNode(child);
        componentChild.parent = workInProgress;
        return componentChild;
    });
    addEffect(() => {
        const nextProps = workInProgress.element.props;
        updateInstance(workInProgress.stateNode as Element, nextProps);
    })
    // Create Children.
    for(let i = 0 ; i < workInProgress.renderedChildren.length ; ++i) {
        const nextChildComponentNode = workInProgress.renderedChildren[i];
        const currentChildComponentNode = current.renderedChildren[i] || null;
        reconcilerComponentNode(currentChildComponentNode,nextChildComponentNode);
    }
    // Delete Children
    for(let i =  workInProgress.renderedChildren.length; i < current.renderedChildren.length ; ++i ) {
        const deleteComponentChild = current.renderedChildren[i];
        addEffect(() => {
            const hostRootOfDeletedChild = findHostRootOfTree(deleteComponentChild);
            if(hostRootOfDeletedChild !== null) {
                removeNode(hostRootOfDeletedChild.stateNode);
            }
        })
    }
    return workInProgress;
}
function reconcilerCustomComponentNode(
    current: CustomComponentNode,
    workInProgress: CustomComponentNode,
): ComponentNode {
    // Tag is Same. divide by if element type is same.
    // Case 1 : elment type is different. it means we need to create a new component-tree,
    // and replace old component tree.
    // Case 2 : element type is same. resume stateNode. and get nextElementChilren by calling
    // method or function. then cintinue recursivly call.
    const preElementType = current.element.type;
    const nextElementType = workInProgress.element.type;
    if(preElementType !== nextElementType) {
        return replaceOldSubTree(current, workInProgress);
    }
    // Update Component Node.
    const nextProps = workInProgress.element.props;
    const nextState = current.pendingState;
    workInProgress.stateNode = current.stateNode;
    let nextChildrenElement: ElementNode | null = null;
    if((workInProgress.element.type as ClassComponentType).isVirtualDOMComponent) {
        const instance = workInProgress.stateNode as BaseComponent;
        instance._internalComponentNode = workInProgress;
        instance.props = nextProps;
        instance.state = !nextState ? instance.state : Object.assign(instance.state, nextState);
        console.log(instance.state);
        nextChildrenElement = instance.render();
    }else {
        const func = workInProgress.element.type as FunctionComponentType;
        nextChildrenElement = func(nextProps);
    }
    // Delete Host Children
    if(nextChildrenElement === null) {
        workInProgress.renderedChildren  = null;
        addEffect(() => {
            const hostRootOfDeletedChild = findHostRootOfTree(current);
            if(hostRootOfDeletedChild !== null) {
                removeNode(hostRootOfDeletedChild.stateNode);
            }
        })
        return workInProgress;
    }
    // Create Children
    workInProgress.renderedChildren = createComponentNodeFromElementNode(nextChildrenElement);
    workInProgress.renderedChildren.parent = workInProgress;
    reconcilerComponentNode(
        current.renderedChildren,
        workInProgress.renderedChildren,
    );
    return workInProgress;
}

function reconcilerHostRootComponent(
    current: HostRootComponent,
    workInProgress: HostRootComponent,
): HostRootComponent {
    workInProgress.stateNode = current.stateNode;
    // Delete Host Children
    if(!workInProgress.childrenElement) {
        return workInProgress;
    }
    // Create Children
    workInProgress.renderedChildren = createComponentNodeFromElementNode(workInProgress.childrenElement);
    workInProgress.renderedChildren.parent = workInProgress;
    const nextChildComponentNode = workInProgress.renderedChildren;
    const currentChildComponentNode = current.renderedChildren;
    reconcilerComponentNode(currentChildComponentNode, nextChildComponentNode);
    return workInProgress;
}

/** ==============================================
 * 
 * @param current 
 * @param workInProgress 
 * @returns 
 * ===============================================
 */
export function reconcilerComponentNode(
    current: ComponentNode | null,
    workInProgress: ComponentNode
): ComponentNode {
    // Case 1 : Current is null. it means we has to render a new 
    // component tree. and mount new component-tree's host-root to 
    // ancestor's host-node in commit phase.
    if(current === null) {
        return createNewSubTree(workInProgress);
    }
    // Case 2 : Tag is different. unmount last component tree. and 
    // create a new component-tree, than replace new component-tree's
    // host-root to last component tree's host root.
    if(current.tag !== workInProgress.tag) {
        return replaceOldSubTree(current, workInProgress);
    }
    // Case 3 : Tag is Same. Solve by each different type of component node.
    // For CustomComponent, it needs to update stateNode and render new component-child
    // For HostComponent, it needs to update host-node and render new component-children
    // for HostTextComponent, it need to update instance.
    if(workInProgress.tag === "HostRootComponent") {
        return reconcilerHostRootComponent(current as HostRootComponent, workInProgress);
    }
    if(workInProgress.tag === "HostComponent") {
        return reconcilerHostComponentNode(current as HostComponentNode, workInProgress);
    }
    if(workInProgress.tag === "HostTextComponent") {
        return reconcilerHostTextComponentNode(current as HostTextComponentNode, workInProgress);
    }
    if(workInProgress.tag === "CustomComponent") {
        return reconcilerCustomComponentNode(current as CustomComponentNode, workInProgress);
    }
    throw new Error(`[Error]: Unknow Component tag happend.`);
}