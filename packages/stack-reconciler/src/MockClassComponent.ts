import { createElement } from "./reconciler/shared/Element";
import { Component } from "@/src/library/component";
import { FunComponent } from "./MockFunComponent";

export class ClassComponent extends Component {
    count: number;
    constructor(props: { [key: string]: any } = { }) {
        super(props);
        this.state = {
            value: 10,
        };
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
        );
    }
}

export default ClassComponent;