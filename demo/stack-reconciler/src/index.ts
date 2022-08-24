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
    const child = props.children ? props.children : [];
    const value = props.value ?  props.value : -1;
    return createElement(
        "div",
        { children: [
            ...child,
            `value is ${value}`
        ] },
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
        this.setState({value: 20});
    }
    render() {
        this.count ++;
        return createElement(
            "div",
            {
                children: [
                    createElement(
                        "p",
                        {
                            children: [
                                `Count State: ${this.count}`,
                            ]
                        }
                    ),
                    "good ",
                    this.props.value ? this.props.value : "10",
                    this.state.value,
                    createElement(
                        "div",
                        {
                            children: [
                                "uu"
                            ]
                        }
                    ),
                    createElement(
                        FunComponent,
                        {
                            children: [
                                "xshaxbsa"
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
        const instance = container.appRootComponent?.stateNode as any;
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
const PureDOMApp = (state: number) => createElement(
    'div',
    {
        children: [
            "text-in-first-div",
            createElement(
                state > 10 ? "p" : "div",
                {
                    children: [
                        "text-in-second-div"
                    ]
                }
            ),
            createElement(
                "div",
                {
                    "style" : state > 10 ? "color:blue;" : "color:red;",
                    children: [
                        state <= 10 
                            ?  createElement(
                                "div",
                                {
                                    children: [' text-in-nested-div ']
                                }
                            ) 
                            :"text-in-other-div"
                    ]
                }
            ),
            createElement(
                'div',
                {
                    children: [
                        `child with state: ${state}`
                    ]
                }
            ),
            createElement(
                FunComponent,
                {
                    value: state <=10 ? -2 : 10,
                    children: [
                        "xshaxbsa"
                    ]
                }
            ),
            createElement(
                MyComponent,
                {
                    value : state > 10 ? "state > 10" : "state < 10",
                    children: [],
                }
            )
        ]
    }
)
function testPureDOMApp() {
    const root = document.getElementById('app');
    const container = createContainer(root as Element);
    container.render(
        PureDOMApp(10),
    )
    setTimeout(() => {
        container.render(
            PureDOMApp(90)
        ) 
    }, 800)
}
/**
 * ===============================================
 *            Test Main Zone
 * -----------------------------------------------
 *          call test-function
 * ==============================================
 */
testPureDOMApp();