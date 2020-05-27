// // taken from https://blog.bitsrc.io/implementing-heaps-in-javascript-c3fbf1cb2e65
// // added some TS types
// export class MinHeap<T> {
//     private heap: T[];
//     private biggerThan: (a: T, b: T) => boolean;
//     private smallerThan: (a: T, b: T) => boolean;

//     constructor(comparator: (left: T, right: T) => -1 | 0 | 1) {
//         /* Initialing the array heap and adding a dummy element at index 0 */
//         this.heap = [null];
//         this.biggerThan = (a, b) => comparator(a, b) > 0;
//         this.smallerThan = (a, b) => comparator(a, b) < 0;
//     }

//     size(): number {
//         return this.heap.length - 1;
//     }

//     getMin(): T {
//         /* Accessing the min element at index 1 in the heap array */
//         return this.heap[1];
//     }

//     insert(node: T): void {

//         /* Inserting the new node at the end of the heap array */
//         this.heap.push(node);

//         /* Finding the correct position for the new node */

//         if (this.heap.length > 1) {
//             let current = this.heap.length - 1;

//             /* Traversing up the parent node until the current node (current) is greater than the parent (current/2)*/
//             while (current > 1 && this.biggerThan(this.heap[Math.floor(current / 2)], this.heap[current])) {
//                 /* Swapping the two nodes by using the ES6 destructuring syntax*/
//                 [this.heap[Math.floor(current / 2)], this.heap[current]] = [this.heap[current], this.heap[Math.floor(current / 2)]];
//                 current = Math.floor(current / 2);
//             }
//         }
//     }

//     remove(): T {
//         /* Smallest element is at the index 1 in the heap array */
//         const smallest = this.heap[1];

//         /* When there are more than two elements in the array, we put the right most element at the first position
//             and start comparing nodes with the child nodes
//         */
//         if (this.heap.length > 2) {
//             this.heap[1] = this.heap[this.heap.length - 1];
//             this.heap.splice(this.heap.length - 1);

//             if (this.heap.length === 3) {
//                 if (this.biggerThan(this.heap[1], this.heap[2])) {
//                     [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]];
//                 }
//                 return smallest;
//             }

//             let current = 1;
//             let leftChildIndex = current * 2;
//             let rightChildIndex = current * 2 + 1;

//             while (this.heap[leftChildIndex] && this.heap[rightChildIndex] &&
//                 (this.smallerThan(this.heap[current], this.heap[leftChildIndex]) ||
//                     this.smallerThan(this.heap[current], this.heap[rightChildIndex]))) {
//                 if (this.smallerThan(this.heap[leftChildIndex], this.heap[rightChildIndex])) {
//                     [this.heap[current], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[current]];
//                     current = leftChildIndex;
//                 } else {
//                     [this.heap[current], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[current]];
//                     current = rightChildIndex;
//                 }

//                 leftChildIndex = current * 2;
//                 rightChildIndex = current * 2 + 1;
//             }
//         } else if (this.heap.length === 2) {
//             this.heap.splice(1, 1);
//         } else {
//             return null;
//         }

//         return smallest;
//     }
// }
