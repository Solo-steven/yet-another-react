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
    appendChild, replaceChild, replaceNode,
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
        const parent = findClosestDOM(shaowCopyPaths);
        const newChild = workInProgress.stateNode as Text | Element;
        appendChild(parent, newChild);
    });
    return workInProgress;
}

function replaceOldSubTree(current: ComponentNode, workInProgress: ComponentNode) {
    renderComponentNode(workInProgress);
    addEffect(() => {
        const oldChild = getHostNode(current);
        const newChild = workInProgress.stateNode as Text;
        replaceNode(oldChild as Element, newChild);
    });
    return workInProgress;
}

function reconcilerHostTextComponentNode(
    current: ComponentNode | null,
    workInProgress: HostTextComponentNode,
    paths: Array<ComponentNode> = [],
): ComponentNode {
    // Case 1: 
    if(current === null) {
        renderComponentNode(workInProgress);
        const shaowCopyPaths = [...paths];
        addEffect(() => {
            const parent = findClosestDOM(shaowCopyPaths);
            const newChild = workInProgress.stateNode as Text;
            appendChild(parent, newChild);
        });
        return workInProgress;
    }
    const preElement = current.element;
    const nexElement = workInProgress.element;
    // Case 2 : Tag is different. unmount pre-component.
    if(current.tag !== workInProgress.tag) {
        renderComponentNode(workInProgress);
        addEffect(() => {
            const oldChild = getHostNode(current);
            const newChild = workInProgress.stateNode as Text;
            replaceNode(oldChild as Element, newChild);
        });
        return workInProgress;
    }
    // Case 3 : Tag is same. because text instance don't need to  replace if next node
    // remind text instance. we can always resume text node in this case.
    // 3-1: type is same. stop resurion.
    // 3-2: type is not same, reconciler TextInstance.
    workInProgress.stateNode = current.stateNode;
    if(preElement === nexElement) {
        return workInProgress;
    }
    addEffect(() => {
        updateTextnstance(workInProgress.stateNode as Text, nexElement);
    })
    return workInProgress;
}
function reconcilerHostComponentNode(
    current: ComponentNode | null ,
    workInProgress: HostComponentNode,
    paths: Array<ComponentNode> = [],
): ComponentNode {
    // 
    if(current === null) {
        renderComponentNode(workInProgress);
        const shaowCopyPaths = [...paths];
        addEffect(() => {
            // side-effect is to replace child from parentNode.
            const parent = findClosestDOM(shaowCopyPaths);
            const newChild = workInProgress.stateNode as Element;
            appendChild(parent, newChild);
        })       
        return workInProgress;
    }
    // Case 1: Tag is different, it means that we can't resume old componentNode's state.
    // render new componentNode and add side-effect to change dom.
    if(current.tag !== workInProgress.tag) {
        renderComponentNode(workInProgress);
        addEffect(() => {
            // side-effect is to replace child from parentNode.
            const oldChild = getHostNode(current) as Element;
            const newChild = workInProgress.stateNode as Element;
            replaceNode(oldChild, newChild);
            // replaceChild(parent, oldChild, newChild);
        })
        return workInProgress;
    }
    // Case 2 : Tag is same. divide by if element type is same.
    // 2-1. if it is not same element.type, we need to mount new componentNode, and add side-effect.
    // 2-2. we need to resume old componentNode if componentNode's element.type is same.
    const preElementType = current.element.type as String;
    const nextElementType = workInProgress.element.type as String;
    const nextChildrenElement  = workInProgress.element.props.children;
    if(preElementType !== nextElementType) {
        renderComponentNode(workInProgress);
        addEffect(() => {
            if(!current.stateNode) {
                throw new Error(``);
            }
            current.stateNode.replaceWith(workInProgress.stateNode as Element);
        });
        return workInProgress;
    }
    workInProgress.stateNode = current.stateNode;
    workInProgress.renderedChildren = nextChildrenElement.map(child => createComponentNodeFromElementNode(child));
    addEffect(() => {
        const nextProps = workInProgress.element.props;
        updateInstance(workInProgress.stateNode as Element, nextProps);
    })
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
    return workInProgress;
}
function reconcilerCustomComponentNode(
    current: ComponentNode | null,
    workInProgress: CustomComponentNode,
    paths: Array<ComponentNode> = [],
): ComponentNode {
    // Case 1 : Current is null. it means we has to render a new 
    // component tree. and mount it's host-root to parent's host-node
    // in commit phase.
    if(current === null) {
        renderComponentNode(workInProgress);
        const shaowCopyPaths = [...paths];
        addEffect(() => {
            // side-effect is to replace child from parentNode.
            const parent = findClosestDOM(shaowCopyPaths);
            const newChild = getHostNode(workInProgress);
            appendChild(parent, newChild);
        })       
        return workInProgress;
    }
    // Case 2 : Tag is different. it means we has to render a new 
    // component tree. and replace it's host root to it's parent.
    if(current.tag !== workInProgress.tag) {
        renderComponentNode(workInProgress);
        const shaowCopyPaths = [...paths];
        addEffect(() => {
            // side-effect is to replace child from parentNode.
            const parent = findClosestDOM(shaowCopyPaths);
            const oldChild = getHostNode(current) as Element;
            const newChild = getHostNode(workInProgress);
            replaceNode(oldChild, newChild);
            // replaceChild(parent, oldChild, newChild);
        })
        return workInProgress;
    }
    // Case 3 : Tag is Same. divide by if element type is same.
    // 3-1 : elment type is different. it means we need to create a new component-tree,
    // and replace old component tree.
    // 3-2 : element type is same. resume stateNode. and get nextElementChilren by calling
    // method or function. then cintinue recursivly call.
    const preElementType = current.element.type;
    const nextElementType = workInProgress.element.type;
    // element type is different.
    if(preElementType !== nextElementType) {
        renderComponentNode(workInProgress);
        const shaowCopyPaths = [...paths];
        addEffect(() => {
            // side-effect is to replace child from parentNode.
            const parent = findClosestDOM(shaowCopyPaths);
            const oldChild = getHostNode(current) as Element;
            const newChild = getHostNode(workInProgress);
            replaceNode(oldChild, newChild);
            // replaceChild(parent, oldChild, newChild);
        });
        return workInProgress;
    }
    // element type is same.
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
    if(nextChildrenElement === null) {
        workInProgress.renderedChildren  = null;
        return workInProgress;
    }
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
export function reconcilerComponentNode(
    current: ComponentNode | null,
    workInProgress: ComponentNode,
    paths: Array<ComponentNode> = [],
): ComponentNode {
    if(workInProgress.tag === "HostComponent") {
        return reconcilerHostComponentNode(current, workInProgress, paths);
    }
    if(workInProgress.tag === "HostTextComponent") {
        return reconcilerHostTextComponentNode(current, workInProgress, paths);
    }
    if(workInProgress.tag === "CustomComponent") {
        return reconcilerCustomComponentNode(current, workInProgress, paths)
    }
    throw new Error(`[Error]: Unknow Component tag happend.`);
}
