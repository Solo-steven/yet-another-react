import { MaxHeap, HeapNode } from "./heap";

export type UnitOfWork = () => UnitOfWork | null | boolean | undefined;
export type WorkNode = HeapNode<UnitOfWork>;

const priorityQueue = new MaxHeap<UnitOfWork>();
let isScheduling: boolean = false;

const mockPriority = [100, 80, 60, 200, 180, 500];
function createWorkNode(unitOfWork: UnitOfWork) {
    const priority = mockPriority[Math.floor(Math.random() * mockPriority.length)];
    return {
        priority, 
        value: unitOfWork,
    } as WorkNode;
};


// uniform dom api
function scheularHostCallBack(callback: any) {
    setTimeout(callback, 0);
};

function executeHeapCallBack() {
    const workNode = priorityQueue.pop();
    if(workNode === null) {
        isScheduling = false;
        return;
    }
    const currentWork = workNode.value;
    const returnWork = currentWork();
    if(!returnWork) {
        scheularHostCallBack(executeHeapCallBack);
        return;
    }
    if(returnWork === true) {
        priorityQueue.push(createWorkNode(currentWork))
    }
    if(typeof(returnWork) === "function") {
        priorityQueue.push(createWorkNode(returnWork));
    }
    scheularHostCallBack(executeHeapCallBack);
    return;
}

export function scheular(unitOfWork: UnitOfWork) {
    const heapNode = createWorkNode(unitOfWork);
    priorityQueue.push(heapNode);
    if(!isScheduling) {
        // Debounce Callback exist in Event Loop.
        scheularHostCallBack(executeHeapCallBack);
    }
}