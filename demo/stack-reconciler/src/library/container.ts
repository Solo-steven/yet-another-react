import { ElementNode} from "@/src/reconciler/shared/Element";
import { ComponentNode, createComponentNodeFromElementNode, getHostNode } from "@/src/reconciler/shared/Component";
import { reconcilerComponentNode } from "@/src/reconciler/update";
import { addEffect, commitEffect } from "@/src/reconciler/commit";
import { appendChild } from "@/src/renderer/HostConfig";
class HostContainter {
    internalHostInstance: Element;
    appRootComponent: ComponentNode | null;
    /**
     * init HostContainer.
     * HostContainer is serve as another ComponentNode. But with 
     * no element. only stateNode and child componentNode. Purpose
     * of this componentNode is to mount root-app to host-container,
     * and remember last componentNode-tree.
     * @param root 
     */
    constructor(root: Element) {
        this.internalHostInstance = root;
        this.appRootComponent = null;
    }
    /**
     * render serve as two purpose function.
     * frist purpose is act like another reconeiler function.
     * second purpose is control life cycle. commit effect after reconciler.
     * @param element : next Child Element.
     * @returns void
     */
    render(element: ElementNode) {
        // Render Phase ( see as another reconciler update function ).
        const fristRenderFlag = this.appRootComponent === null;
        const current = this.appRootComponent;
        const workInProgress = createComponentNodeFromElementNode(element);
        reconcilerComponentNode(current, workInProgress);
        if(fristRenderFlag) {
            addEffect(() => {
                const childHostRoot = getHostNode(workInProgress);
                appendChild(this.internalHostInstance, childHostRoot);
            })
        }
        this.appRootComponent = workInProgress;
        // Commit Phase (commit all side effect).
        commitEffect();
    }
}

/**
 * 
 */
export function createContainer(root: Element): HostContainter {
    return new HostContainter(root);
}
export default createContainer;