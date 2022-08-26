/**
 * ===============================================
 *              Test Script 
 * -----------------------------------------------
 * lib should act like following:
 *  1. call `createContainer` to create a new container instance.
 *  2. call `render` or call `setState` to re-render.
 *  *** createElement is JSX function ***
 * ==============================================
 */
import { createElement } from "./reconciler/shared/Element";
import { Component } from "@/src/library/component";
import { createContainer } from "@/src/library/container";
/**
 * Shared component for test.
 * @param props 
 * @returns 
 */
function FunComponent (props: { [key: string]: any } = { }) {
    const children = props.children ? props.children : [];
    console.log(children, ...children);
    return createElement(
        "div",
        { 
            children: [
                createElement(
                    "h3",
                    {
                        children: ["This is Title for Function Component"]
                    }
                ),
                "Some Text Content for Testing",
                createElement(
                    "p",
                    {
                        children: [`current props value is : ${props.value ? props.value : "No Props In" }`]
                    }
                ),
                ...children,
            ] 
        },
    )
}
/**
 * ===============================================
 *            Test - Class Component
 * -----------------------------------------------
 *  test render a app with root is class component
 *  and setState should cat tigger re-render, and 
 *  update state.
 * ==============================================
 */
class MyComponent extends Component {
    count: number;
    constructor(props: { [key: string]: any } = { }) {
        super(props);
        this.state = {
            value: 10,
        }
        this.count = 0;
    }
    tigger() {
        this.setState({value: this.state.value + 10});
    }
    render() {
        this.count ++;
        return  this.props.value === "100" ? null : createElement(
            "div",
            {
                children: [
                    createElement(
                        "h1", 
                        {
                            children: [ "This is Title of Class Component"]
                        }
                    ),
                    createElement(
                        "p",
                        {
                            children: [`current state value is : ${this.state.value}`]
                        }
                    ),
                    "Some Text Content for Testing",
                    createElement(
                        "p",
                        {
                            children: [`current props value is : ${this.props.value ? this.props.value : "No Props In" }`]
                        }
                    ),
                    createElement(
                        FunComponent,
                        {
                            children: [
                                "Content Pass From Class Component"
                            ]
                        }
                    )
                ]
            }
        )
    }
};
const ClassComponent = (props = {
    value: 50, 
    children: []
}) => createElement(MyComponent, props);
function testClassRootComponent() {
    const root = document.getElementById('app');
    const container = createContainer(root as Element);
    container.render(
        ClassComponent()
    )
    setTimeout(() => {
        const instance = (container.appRootComponent as any).renderedChildren.stateNode
        console.log(container);
        instance.tigger();
    }, 2000)
};
/**
 * ===============================================
 *            Test - Pure DOM Component
 * -----------------------------------------------
 *  test render a app with host-component root,
 *  and use render function to re-render.
 * ==============================================
 */
const PureDOMApp = (flag: boolean = false) => createElement(
    'div',
    {
        children: [
            "Some Text Content for Testing",
            createElement(
                flag ? "p" : "div",
                {
                    children: [
                        "Element Block Which Tag Would Changed By props's value."
                    ]
                }
            ),
            createElement(
                "div",
                {
                    "style" : flag ? "color:blue;" : "color:red;",
                    children: [
                        "Element Block Style Attr Would changed by props."
                    ]
                }
            ),
            createElement(
                "div",
                {
                    children: flag ? [
                        createElement(
                            "span",
                            {
                                children: [ "Element Block" ]
                            }
                        ),
                        createElement(
                            "span",
                            {
                                children: [ "Structure Changed By Prop" ]
                            }
                        ),
                        createElement(
                            "span",
                            {
                                children: [ "Now is 3 Span" ]
                            }
                        )
                    ] : [
                        createElement(
                            "span",
                            {
                                children: [ "Element Block Structure Changed By Prop Now is 1 Span" ]
                            }
                        )
                    ]
                }
            ),
            createElement(
                FunComponent,
                {
                    value: flag ? -2 : 10,
                    children: [
                        "Some Text Content Pass as Children to Function Component",
                        createElement(
                            "p",
                            {
                                children: [
                                    "A P-tag Element Pass to Function Component",
                                ]
                            }
                        )
                    ]
                }
            )
        ]
    }
)
function testPureDOMApp() {
    const root = document.getElementById('app');
    const container = createContainer(root as Element);
    container.render(
        PureDOMApp(false),
    )
    console.log(container);
    setTimeout(() => {
        container.render(
            PureDOMApp(true)
        ) 
        console.log(container);
    }, 800);
}
/**
 * ===============================================
 *            Test Main Zone
 * -----------------------------------------------
 *          call test-function
 * ==============================================
 */
testPureDOMApp();