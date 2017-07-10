/**
 * Gets the index of the parent of the given index in the heap-array.
 *
 * @private
 * @param {number} index  The index of the child of which to find the parent.
 * @returns {number} the parent index
 */
function getParent(index) {
  return Math.floor((index - 1) / 2);
}

/**
 * Gets the indexes of the children of the node at the given index.
 *
 * @private
 * @param {number} index  The index of the parent of which to find the
 * children.
 * @returns {number[]} an array of the children indexes
 */
function getChildren(index) {
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
export default class Heap {

  /**
   * Create a Heap.
   *
   * @param {*[]} [list] A list of initial entries into the heap
   * @param {Function} [cmp] A function to compare elements in the heap
   */
  constructor(list = [], cmp = (a, b) => a < b) {
    this._cmp = cmp;
    this._heap = list;
    for (let i = Math.floor(this._heap.length / 2) - 1; i >= 0; i--) {
      this._heapify(i);
    }
  }

  /**
   * The number of elements in the heap
   *
   * @type {number}
   */
  get length() {
    return this._heap.length;
  }

  /**
   * Insert a new element into the heap, maintaining the heap property.
   *
   * @param {*} value The value to insert
   * @returns {number} The new size of the heap
   */
  push(value) {
    let index = this._heap.push(value) - 1;
    let check = true;
    while (check) {
      const parent = getParent(index);
      if (parent >= 0 && this._cmp(value, this._heap[parent])) {
        this._swap(index, parent);
        index = parent;
      } else {
        check = false;
      }
    }
    return this.length;
  }

  /**
   * Gets the min value and removes it from the heap, adjusting everything else
   * in the heap to maintain heap property, then returns the value.
   *
   * @returns {*} The min value in the heap.
   */
  pop() {
    // remove and store lowest value
    const min = this._heap.shift();
    if (typeof min === 'undefined') {
      return null;
    }
    if (this._heap.length) {
      // put the last element into the root position
      this._heap.unshift(this._heap.pop());
      this._heapify();
    }
    return min;
  }

  /**
   * Checks if the value is inside the collection
   *
   * @param {*} value The value to find
   * @returns {boolean} Whether or not the value was found in the collection
   */
  contains(value) {
    return this._heap.indexOf(value) >= 0;
  }

  /**
   * Iteratively goes through tree, ensuring heap property is maintained,
   * correcting it if not.
   *
   * @private
   * @param {number} i The index of what should be the largest node of a subtree
   */
  _heapify(i = 0) {
    // if this breaks the heap property, fix it. rinse and repeat until heap
    // property is true.
    const len = this._heap.length;
    let largest = i;
    getChildren(i).forEach((child) => {
      if (child < len && this._cmp(this._heap[child], this._heap[largest])) {
        largest = child;
      }
    });
    if (largest !== i) {
      this._swap(largest, i);
      this._heapify(largest);
    }
  }

  /**
   * Swaps two indexes in the heap.
   *
   * @private
   * @param {number} a First element to swap
   * @param {number} b Second element to swap
   */
  _swap(a, b) {
    [this._heap[a], this._heap[b]] = [this._heap[b], this._heap[a]];
  }
  /**
   * Gets the min value of the heap (if your cmp function is a less-than
   * comparison).
   *
   * @returns {*} The min value
   */
  findMin() {
    return this._heap[0];
  }

  /**
   * Gets the max value of the heap (if your cmp function is a greater-than
   * comparison). (Functionally, identical to findMin -- included for semantic
   * reasons based on comparison function)
   *
   * @returns {*} The max value
   */
  findMax() {
    return this._heap[0];
  }
}
