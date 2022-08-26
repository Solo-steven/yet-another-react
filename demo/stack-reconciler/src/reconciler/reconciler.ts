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
    findClosestDOM, getHostNode
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
function createNewSubTree(workInProgress: ComponentNode, paths: Array<ComponentNode> ) {
    renderComponentNode(workInProgress);
    const shaowCopyPaths = [...paths];
    addEffect(() => {
        // perform side-effect to mount new component-tree to it's host parent.
        const parent = findClosestDOM(shaowCopyPaths);
        const newChild = workInProgress.stateNode as Text | Element;
        appendChild(parent, newChild);
    });
    return workInProgress;
}
function replaceOldSubTree(current: ComponentNode, workInProgress: ComponentNode) {
    renderComponentNode(workInProgress);
    addEffect(() => {
        // perform side-effect to replace last compoent-tree's host root.
        const oldChild = getHostNode(current);
        const newChild = workInProgress.stateNode as Text;
        replaceNode(oldChild as Element, newChild);
    });
    return workInProgress;
}

function reconcilerHostTextComponentNode(
    current: HostTextComponentNode,
    workInProgress: HostTextComponentNode,
    _paths: Array<ComponentNode> = [],
): ComponentNode {
    // Tag is same. because text instance don't need to  replace if next node
    // remind text instance. we can always resume text node in this case.
    // Case 1 : type is same. stop resurion.
    // Case 2 : type is not same, reconciler TextInstance.
    workInProgress.stateNode = current.stateNode;
    const preElement = current.element;
    const nexElement = workInProgress.element;
    if(preElement === nexElement) {
        return workInProgress;
    }
    addEffect(() => {
        updateTextnstance(workInProgress.stateNode as Text, nexElement);
    })
    return workInProgress;
}
function reconcilerHostComponentNode(
    current: HostComponentNode ,
    workInProgress: HostComponentNode,
    paths: Array<ComponentNode> = [],
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
    workInProgress.renderedChildren = nextChildrenElement.map(child => createComponentNodeFromElementNode(child));
    addEffect(() => {
        const nextProps = workInProgress.element.props;
        updateInstance(workInProgress.stateNode as Element, nextProps);
    })
    // Create Children.
    paths.push(workInProgress);
    for(let i = 0 ; i < workInProgress.renderedChildren.length ; ++i) {
        const nextChildComponentNode = workInProgress.renderedChildren[i];
        const currentChildComponentNode = (current.renderedChildren as Array<ComponentNode>)[i];
        reconcilerComponentNode(
            currentChildComponentNode,
            nextChildComponentNode,
            paths,
        )
    }
    paths.pop();
    // Delete Children
    for(let i =  workInProgress.renderedChildren.length -1; i < current.renderedChildren.length ; ++i ) {
        const deleteComponentChild = current.renderedChildren[i];
        addEffect(() => {
            const host = getHostNode(deleteComponentChild);
            removeNode(host);
        })
    }
    return workInProgress;
}
function reconcilerCustomComponentNode(
    current: CustomComponentNode,
    workInProgress: CustomComponentNode,
    paths: Array<ComponentNode> = [],
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
        instance.props = nextProps;
        instance.state = nextState === null ? instance.state : Object.assign(instance.state, nextState);
        nextChildrenElement = instance.render();
    }else {
        const func = workInProgress.element.type as FunctionComponentType;
        nextChildrenElement = func(nextProps);
    }
    // Delete Host Children
    if(nextChildrenElement === null) {
        workInProgress.renderedChildren  = null;
        addEffect(() => {
            const host = getHostNode(current);
            if(host !== null) removeNode(host);
        })
        return workInProgress;
    }
    // Create Children
    workInProgress.renderedChildren = createComponentNodeFromElementNode(nextChildrenElement);
    paths.push(workInProgress);
    reconcilerComponentNode(
        current.renderedChildren,
        workInProgress.renderedChildren,
        paths,
    );
    paths.pop();
    return workInProgress;
}

/** ==============================================
 * 
 * @param current 
 * @param workInProgress 
 * @param paths 
 * @returns 
 * ===============================================
 */
export function reconcilerComponentNode(
    current: ComponentNode | null,
    workInProgress: ComponentNode,
    paths: Array<ComponentNode> = [],
): ComponentNode {
    // Case 1 : Current is null. it means we has to render a new 
    // component tree. and mount new component-tree's host-root to 
    // ancestor's host-node in commit phase.
    if(current === null) {
        return createNewSubTree(workInProgress, paths);
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
    if(workInProgress.tag === "HostComponent") {
        return reconcilerHostComponentNode(current as HostComponentNode, workInProgress, paths);
    }
    if(workInProgress.tag === "HostTextComponent") {
        return reconcilerHostTextComponentNode(current as HostTextComponentNode, workInProgress, paths);
    }
    if(workInProgress.tag === "CustomComponent") {
        return reconcilerCustomComponentNode(current as CustomComponentNode, workInProgress, paths)
    }
    throw new Error(`[Error]: Unknow Component tag happend.`);
}