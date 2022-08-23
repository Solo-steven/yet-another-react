import { BaseComponent } from "@/src/reconciler/shared/Element";
import { ComponentNode, createComponentNodeFromElementNode } from "../reconciler/shared/Component";
import { reconcilerComponentNode } from "@/src/reconciler/update";
import { commitEffect } from "@/src/reconciler/commit";

export class Component extends BaseComponent {
    constructor(props: {[key: string]: any } = {}) {
        super(props);
    }
    /**
     * 
     * @param nextState 
     */
    setState(nextState: {[key: string]: any } = {}) {
        // Prepare
        const componetNode = this._internalComponentNode as ComponentNode;
        const element = componetNode.element;
        const workInProgress = createComponentNodeFromElementNode(element);
        workInProgress.stateNode = componetNode.stateNode;
        // Render
        const instance = workInProgress.stateNode as BaseComponent;
        instance.state = Object.assign(instance.state, nextState);
        console.log(instance.state, nextState);
        const nextChildrenElement = instance.render();
        if(nextChildrenElement === null) {
            return;
        }
        const current = this._internalComponentNode;
        workInProgress.renderedChildren = createComponentNodeFromElementNode(nextChildrenElement);
        reconcilerComponentNode(current, workInProgress);
        // commit effect.
        commitEffect();
    }
}

export default Component;