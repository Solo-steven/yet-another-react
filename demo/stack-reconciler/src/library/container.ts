import { ElementNode} from "@/src/reconciler/shared/Element";
import { ComponentNode, createHostRootComponentNode } from "@/src/reconciler/shared/Component";
import { reconcilerComponentNode } from "@/src/reconciler/reconciler";
import { commitEffect } from "@/src/reconciler/commit";
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
        this.appRootComponent = createHostRootComponentNode(null);
        this.appRootComponent.stateNode = root;
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
        const current = this.appRootComponent;
        const workInProgress = createHostRootComponentNode(element);
        reconcilerComponentNode(current, workInProgress);
        this.appRootComponent = workInProgress;
        // Commit Phase (commit all side effect).
        commitEffect();
    }
}

/**
 *  React-like api format.
 */
export function createContainer(root: Element): HostContainter {
    return new HostContainter(root);
}
export default createContainer;