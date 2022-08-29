import { scheular } from "./scheduler";

const createUnitOfWork = (context: number, threshold: number = 0.995) => 
    function MockUpCallBack() {
        while(Math.random() < threshold) {
            console.log(`This is No ${context} function`);
            return true;
        }
        return null;
    };


function main() {
    scheular(createUnitOfWork(1, 0.999995));
    scheular(createUnitOfWork(2, 0.999995));
    scheular(createUnitOfWork(5, 0.999995));
}

main();