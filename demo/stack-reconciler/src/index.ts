import { createElement, BaseComponent, PropsType } from "./reconciler/shared/Element";
import { getHostNode } from "./reconciler/shared/Component";
import { createContainer } from "@/src/library/container";

function FunComponent (props: PropsType) {
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
class MyComponent extends BaseComponent {
    constructor(props?: PropsType) {
        super(props);
    }
    tigger() {
        this.setState();
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
        return createElement(
            "div",
            {
                children: [
                    "good",
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
            )
        ]
    }
)


const root = document.getElementById('app');
const container = createContainer(root as Element);

container.render(
    // <MyComponent />
    PureDOMApp(10),
)

console.log(getHostNode(container.appRootComponent as any));

setTimeout(() => {
    console.log("Call Render");
    container.render(
        // <MyComponent />
        PureDOMApp(90)
    )
    
}, 800)






