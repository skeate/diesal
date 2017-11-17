/**
 * Gets the index of the parent of the given index in the heap-array.
 */
function getParent(index: number): number {
  return Math.floor((index - 1) / 2);
}

/**
 * Gets the indexes of the children of the node at the given index.
 */
function getChildren(index: number): [number, number] {
  return [2 * index + 1, 2 * index + 2];
}

/**
 * A Heap is a data structure that satisfies the *heap property*: if A is
 * a parent node of B, then the value of node A is ordered with respect to the
 * value of B, with the same ordering applying across all nodes. Heaps are an
 * implementation of a Priority Queue, providing fast (O(1)) access to the min,
 * and reasonable (O(logn) or better, depending on variant) performance for
 * insert and delete.
 *
 * This particular implementation is of a binary heap, where each node has 0-2
 * children.
 *
 * For more information:
 *
 * [Heaps][Heap]
 *
 * [Binary Heaps][BinHeap]
 *
 * Note that in all descriptions, where we use "min", it really depends on what
 * your comparison function is. The default is a min function.
 *
 * [Heap]: https://en.wikipedia.org/wiki/Heap_(data_structure)
 * [BinHeap]: https://en.wikipedia.org/wiki/Binary_heap
 */
export default class Heap<T> {
  private heap: T[];

  constructor(list: T[] = [], private cmp: (a: T, b: T) => boolean = (a, b) => a < b) {
    this.heap = list;
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapify(i);
    }
  }

  /**
   * The number of elements in the heap
   *
   * @type {number}
   */
  get size(): number {
    return this.heap.length;
  }

  /**
   * Insert a new element into the heap, maintaining the heap property.
   */
  push(value: T): number {
    let index = this.heap.push(value) - 1;
    let check = true;
    while (check) {
      const parent = getParent(index);
      if (parent >= 0 && this.cmp(value, this.heap[parent])) {
        this.swap(index, parent);
        index = parent;
      } else {
        check = false;
      }
    }
    return this.size;
  }

  /**
   * Gets the min value and removes it from the heap, adjusting everything else
   * in the heap to maintain heap property, then returns the value.
   */
  pop(): T | null {
    // remove and store lowest value
    const min = this.heap.shift();
    if (typeof min === 'undefined') {
      return null;
    }
    const tail = this.heap.pop();
    if (tail) {
      this.heap.unshift(tail);
      this.heapify();
    }
    return min;
  }

  /**
   * Checks if the value is inside the collection
   */
  contains(value: T): boolean {
    return this.heap.indexOf(value) >= 0;
  }

  /**
   * Iteratively goes through tree, ensuring heap property is maintained,
   * correcting it if not.
   */
  private heapify(i = 0): void {
    // if this breaks the heap property, fix it. rinse and repeat until heap
    // property is true.
    const len = this.heap.length;
    let largest = i;
    getChildren(i).forEach((child) => {
      if (child < len && this.cmp(this.heap[child], this.heap[largest])) {
        largest = child;
      }
    });
    if (largest !== i) {
      this.swap(largest, i);
      this.heapify(largest);
    }
  }

  /**
   * Swaps two indexes in the heap.
   */
  private swap(a: number, b: number): void {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  /**
   * Gets the min value of the heap (if your cmp function is a less-than
   * comparison).
   */
  findMin(): T | undefined {
    return this.heap[0];
  }

  /**
   * Gets the max value of the heap (if your cmp function is a greater-than
   * comparison). (Functionally, identical to findMin -- included for semantic
   * reasons based on comparison function)
   */
  findMax(): T | undefined{
    return this.heap[0];
  }
}
