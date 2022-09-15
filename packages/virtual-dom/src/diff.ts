import { VirtualNode } from "./type";
import { transform } from "./render";

export const diffNode = (oldVDom: VirtualNode | null, newVDom: VirtualNode | null) => {
    if(!oldVDom && !newVDom) {
        return () => {};
    }
    if(!newVDom) {
        return (dom: Element) => { dom.remove() }
    }
    if(!oldVDom) {
        return (parentNode: Element) => { parentNode.appendChild(transform(newVDom));}
    }
    if(
        typeof oldVDom === "string" || typeof newVDom === "string" ||
        typeof oldVDom === "number" || typeof newVDom === "number"
    ) {
        if( 
            (typeof oldVDom === "string" || typeof oldVDom === "number") &&
            (typeof newVDom === "string" || typeof newVDom === "number")
        ) {
            return (textNode: Text) => {
                textNode.textContent = String(newVDom);
            };
        }
        if(typeof oldVDom === "string" || typeof oldVDom === "number") {
            return (dom: Element) => {
                dom.replaceWith(transform(newVDom))
            }
        }
        if  (typeof newVDom === "string" || typeof newVDom === "number") {
            return (dom: Element) => {
                dom.replaceWith(transform(newVDom))
            }
        }
    } 
    if(oldVDom.type !== newVDom.type) {
        return (dom: Element) => {
            dom.replaceWith(transform(newVDom));
        }
    }
    const patchProps: Array<Function> = [];
    for(const [key, value] of Object.entries(newVDom.props)) {
        patchProps.push((dom: Element) => {
            dom.setAttribute(key, value);
        })
    }
    const patchChild: Array<Function> = [];
    for (let i=0; i< oldVDom.children.length; i ++ ) {
        patchChild.push(diffNode(oldVDom.children[i], newVDom.children[i]));
    }
    const createChild: Array<Function> = []
    for(let i= oldVDom.children.length; i < newVDom.children.length; i++) {
        createChild.push(diffNode(oldVDom.children[i], newVDom.children[i]));
    }

    return (dom: Element) => {
        patchProps.forEach(patch => patch(dom) );
        for(let i =0 ; i< dom.childNodes.length ; i++) {
            patchChild[i](dom.childNodes[i]);
        }
        createChild.forEach(patch  => patch(dom));
    }
}

const _testOld: VirtualNode = {
    type: "div",
    props: {
        'style': "color:blue"
    },
    children: [
        {
            type: 'div',
            props: {
                'style': "color:red"
            },
            children: ['red text']
        },
        'blue text'
    ]
}


const _testNew = {
    type: "div",
    props: {
        'style': "color:red"
    },
    children: [
        {
            type: 'div',
            props: {
                'style': "color:blue"
            },
            children: ['red text']
        },
        {
            type: 'p',
            props: {
                'style': "color:green"
            },
            children: ['green text']
        },
        'blue text'
    ]
}
const currentDOM = transform(_testOld) ;

console.log("Start ==", currentDOM);
setTimeout(() => {
const patch = diffNode(_testOld, _testNew);
patch(currentDOM as any);
console.log("End ===", currentDOM);
}, 1000)