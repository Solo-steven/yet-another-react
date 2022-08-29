export type HeapNode<T> = {
    priority: number;
    value: T;
}

export class MaxHeap<T> {
    heap: Array<HeapNode<T>>;
    constructor() {
        this.heap = [];
    }
    swap(parentIndex: number, childIndex: number) {
        const maxLen = this.heap.length;
        if(parentIndex >= maxLen || parentIndex < 0 || childIndex >= maxLen || parentIndex < 0) {
            throw new Error(`[Error]: Heap Swap Index is out of range.`);
        }
        const temp = this.heap[parentIndex];
        this.heap[parentIndex] = this.heap[childIndex];
        this.heap[childIndex] = temp; 
    }

    push(node: HeapNode<T>) {
        this.heap.push(node);
        let current = this.heap.length - 1;
        let parent = Math.floor((current -1) /2);
        while(current > 0) {
            const currentNode = this.heap[current];
            const parentNode = this.heap[parent];
            if(currentNode.priority <= parentNode.priority) {
                break;
            }
            this.swap(parent, current);
            current = parent;
            parent = Math.floor(current /2);
        }
    }
    pop() {
        // Case 1 : Heap is NULL.
        if(this.heap.length === 0) {
            return null;
        }
        // Case 2 : Heap only has root.
        const head = this.heap[0];
        const tail = this.heap.pop();
        if(head === tail) {
            return head;
        }
        // Case 3 : More than two nodes.
        this.heap[0] =  tail as HeapNode<T>;
        let rootIndex = 0;
        let leftIndex  = 2 * (rootIndex+1) -1;
        let rightIndex = 2 * (rootIndex+1) +1 -1;

        while(leftIndex < this.heap.length) {
            // Get Node By Index.
            const left = this.heap[leftIndex];
            const right = this.heap[rightIndex] || null;
            const root = this.heap[rootIndex];
            // Get Max Child.
            let maxChildIndex = 0;
            if(right === null) {
                maxChildIndex = leftIndex;
            }else if(right.priority > left.priority) {
                maxChildIndex = rightIndex;
            }else {
                maxChildIndex = leftIndex;
            }
            let maxChild = this.heap[maxChildIndex];
            // Continue Loop if Child > Root.
            if(root.priority < maxChild.priority) {
                this.swap(rootIndex, maxChildIndex);
                rootIndex = maxChildIndex;
                leftIndex  = 2 * (rootIndex+1) -1;
                rightIndex = 2 * (rootIndex+1) +1 -1;
            }else {
                break;
            }
        }
        return  head;
    }
}

export default MaxHeap;