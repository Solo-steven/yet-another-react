import { BaseComponent } from "@/src/reconciler/shared/Element";
import { CustomComponentNode, createComponentNodeFromElementNode } from "../reconciler/shared/Component";
import { reconcilerComponentNode } from "@/src/reconciler/reconciler";
import { commitEffect } from "@/src/reconciler/commit";

export class Component extends BaseComponent {
    constructor(props: {[key: string]: any } = {}) {
        super(props);
    }
    /**
     * render serve as two purpose function.
     * frist purpose is update state.
     * second purpose is entry to reconciler function.
     * @param nextState : next state.
     * @returns void
     */
    setState(nextState: {[key: string]: any } = {}) {
        // Prepare
        const current = this._internalComponentNode as CustomComponentNode;
        current.pendingState = nextState;
        const element = current.element;
        const workInProgress = createComponentNodeFromElementNode(element);
        // Render.
        reconcilerComponentNode(current, workInProgress);
        // Commit effect.
        commitEffect();
    }
}

export default Component;