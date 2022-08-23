import { createElement } from "./reconciler/shared/Element";
import { Component } from "@/src/library/component";
import { createContainer } from "@/src/library/container";

function FunComponent (props: { [key: string]: any } = { }) {
    const child = props?.children ? props.children : [];
    const value = props.value ?  props.value : -1;
    return createElement(
        "div",
        { children: [
            ...child,
            `value is ${value}`
        ] },
    )
}
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
    /**
        <div>
            good
            <div>
                uu
            </div>
            <FunComponent>
                nothinbs
            </FunComponent>
        </div>
     */
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


const root = document.getElementById('app');
const container = createContainer(root as Element);

container.render(
    // <MyComponent />
    //PureDOMApp(10),
    createElement(
        MyComponent,
    )
)

setTimeout(() => {
    const instance = container.appRootComponent?.stateNode as any;
    console.log(instance);
    instance.tigger();
}, 2000)
// setTimeout(() => {
//     console.log("Call Render");
//     container.render(
//         // <MyComponent />
//         PureDOMApp(90)
//     )
    
// }, 800)






