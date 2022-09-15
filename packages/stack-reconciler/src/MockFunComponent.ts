import { createElement } from "./reconciler/shared/Element";
/**
 * Shared component for test.
 * @param props 
 * @returns 
 */
 export function FunComponent (props: { [key: string]: any } = { }) {
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
    );
}

export default FunComponent;