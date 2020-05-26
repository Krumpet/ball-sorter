import MinHeap from './MinHeap';
import Comparator from './Comparator';

// It is the same as min heap except that when comparing two elements
// we take into account its priority instead of the element's value.
export default class PriorityQueue<T> extends MinHeap<T> {
  priorities: Map<T, number>;
  compare: Comparator<T>;

  constructor(compareFunc: (a: T, b: T) => 0 | 1 | -1) {
    // Call MinHip constructor first.
    super(compareFunc);

    // Setup priorities map.
    this.priorities = new Map<T, number>();

    // Use custom comparator for heap elements that will take element priority
    // instead of element value into account.
    this.compare = new Comparator(this.comparePriority.bind(this));
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

  /**
   * Change priority of the item in a queue. This needs a reference to the object!
   * @param {*} item - item we're going to re-prioritize.
   * @param {number} priority - new item's priority.
   * @return {PriorityQueue}
   */
  changePriority(item: T, priority: number): PriorityQueue<T> {
    this.remove(item, new Comparator(this.compareValue));
    this.add(item, priority);
    return this;
  }

  /**
   * Find item by ite value.
   * @param {*} item
   * @return {Number[]}
   */
  findByValue(item: T): number[] {
    return this.find(item, new Comparator(this.compareValue));
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
  comparePriority(a: T, b: T): number {
    if (this.priorities.get(a) === this.priorities.get(b)) {
      return 0;
    }
    return this.priorities.get(a) < this.priorities.get(b) ? -1 : 1;
  }

  /**
   * Compares values of two items.
   * @param {*} a
   * @param {*} b
   * @return {-1|0|1}
   */
  compareValue(a: T, b: T): -1 | 0 | 1 {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }
}
