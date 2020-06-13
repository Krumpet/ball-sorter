import Heap from './Heap';

export default class MinHeap<T> extends Heap<T> {
  /**
   * Checks if pair of heap elements is in correct order.
   * For MinHeap the first element must be always smaller or equal.
   * For MaxHeap the first element must be always bigger or equal.
   *
   * @param {T} firstElement
   * @param {T} secondElement
   * @return {boolean}
   */
  pairIsInCorrectOrder(firstElement: T, secondElement: T): boolean {
    return this.compare.lessThanOrEqual(firstElement, secondElement);
  }
}
