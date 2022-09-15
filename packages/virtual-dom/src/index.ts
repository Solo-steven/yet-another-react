import { createElement,  transform, mount } from "./render";
import { diffNode } from "./diff";

const App = (state: any) => createElement(
    'div',
    {  'style': 'color: blue'},
    [
        createElement(
            'div',
            { 'style': 'color: red;'},
            ['red word']
        ),
        'blue word',
        createElement(
            'input',
            {},
            []
        ),
        `State word : ${state}`
    ]
);

let currentVDOM = App("state 00");

mount(
    transform(currentVDOM),
    document.getElementById('root') as HTMLElement,
);


setTimeout(() => {
    const newVDOM = App("state 01");
    const patch = diffNode(currentVDOM, newVDOM);
    const root = (document.getElementById('root') as HTMLElement).children[0];
    patch(root as any);
}, 1000)


