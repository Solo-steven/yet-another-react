import { ElementNode} from "@/src/reconciler/shared/Element";
import { ComponentNode, createComponentNodeFromElementNode, getHostNode } from "@/src/reconciler/shared/Component";
import { reconcilerComponentNode } from "@/src/reconciler/update";
import { commitEffect } from "@/src/reconciler/commit";
import { appendChild } from "@/src/renderer/HostConfig";

class HostContainter {
    internalHostInstance: Element;
    appRootComponent: ComponentNode | null;
    constructor(root: Element) {
        this.internalHostInstance = root;
        this.appRootComponent = null;
    }
    render(element: ElementNode) {
        const workInProgress = createComponentNodeFromElementNode(element);
        reconcilerComponentNode(this.appRootComponent as any, workInProgress);
        if(this.appRootComponent === null) {
            const childHostRoot = getHostNode(workInProgress);
            appendChild(this.internalHostInstance, childHostRoot);
            this.appRootComponent = workInProgress;
            return;
        }
        this.appRootComponent = workInProgress;
        commitEffect();
    }
}
export function createContainer(root: Element): HostContainter {
    return new HostContainter(root);
}