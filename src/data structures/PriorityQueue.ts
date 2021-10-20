import MinHeap from './MinHeap';
import Comparator from './Comparator';

// It is the same as min heap except that when comparing two elements
// we take into account its priority instead of the element's value.
export default class PriorityQueue<T> extends MinHeap<T> {
  priorities: Map<T, number>;
  compare: Comparator<T>;
  compareValue: Comparator<T>;

  constructor(compareFunc: (a: T, b: T) => 0 | 1 | -1, compareValueFunc: (a: T, b: T) => 0 | 1 | -1) {
    // Call MinHip constructor first.
    super(compareFunc);

    // Setup priorities map.
    this.priorities = new Map<T, number>();

    // Use custom comparator for heap elements that will take element priority
    // instead of element value into account.
    this.compare = new Comparator(this.comparePriority.bind(this));
    this.compareValue = new Comparator(compareValueFunc);
  }

  /**
   * Add item to the priority queue.
   * @param {*} item - item we're going to add to the queue.
   * @param {number} [priority] - items priority.
   * @return {PriorityQueue}
   */
  add(item: T, priority: number = 0): PriorityQueue<T> {
    this.priorities.set(item, priority);
    super.add(item);
    return this;
  }

  /**
   * Remove item from priority queue. Can pass in a way to test for object identity
   * @param {*} item - item we're going to remove.
   * @param {Comparator} [customFindingComparator] - custom function for finding the item to remove
   * @return {PriorityQueue}
   */
  remove(item: T, customFindingComparator?: Comparator<T>): PriorityQueue<T> {
    super.remove(item, customFindingComparator);
    this.priorities.delete(item);
    return this;
  }

  removeMatching(item: T, customFindingComparator = this.compareValue): PriorityQueue<T> {
    super.remove(item, customFindingComparator);
    let entryToRemove: T | null = null;
    for (const entry of this.priorities) {
      if (customFindingComparator.equal(entry[0], item)) {
        entryToRemove = entry[0];
        break;
      }
    }
    if (entryToRemove) {
      this.priorities.delete(entryToRemove);
    }
    return this;
  }

  // removeAtIndices(indices: number[]): void {
  //   if (indices.length === 0) { return; }
  //   if (indices.length === 1) {
  //     const item = this.heapContainer.find((_item, index) => index === indices[0]);
  //     this.remove(item);
  //     return;
  //   } else {
  //     const items = this.heapContainer.filter((_item, index) => indices.includes(index));
  //     items.forEach(item => this.remove(item));
  //   }
  // }

  /**
   * Change priority of the item in a queue. This needs a reference to the object!
   * @param {*} item - item we're going to re-prioritize.
   * @param {number} priority - new item's priority.
   * @return {PriorityQueue}
   */
  changePriority(item: T, priority: number): PriorityQueue<T> {
    this.remove(item, this.compareValue);
    this.add(item, priority);
    return this;
  }

  poll() {
    const result = super.poll();
    if (result) {
      this.priorities.delete(result);
    }
    return result;
  }

  /**
   * Find item by ite value.
   * @param {*} item
   * @return {Number[]}
   */
  findByValue(item: T): number[] {
    return this.find(item, this.compareValue);
  }

  /**
   * Check if item already exists in a queue.
   * @param {*} item
   * @return {boolean}
   */
  hasValue(item: T): boolean {
    return this.findByValue(item).length > 0;
  }

  /**
   * Compares priorities of two items.
   * @param {*} a
   * @param {*} b
   * @return {number}
   */
  private comparePriority(a: T, b: T): -1 | 0 | 1 {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const priorityA = this.priorities.get(a)!, priorityB = this.priorities.get(b)!;
    if (priorityA === priorityB) {
      return 0;
    }
    return priorityA < priorityB ? -1 : 1;
  }
}
