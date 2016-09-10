/**
 * A binary heap implementation. Note that in all descriptions, where we use
 * "min", it really depends on what your comparison function is. The default is
 * a min function.
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
    this.heap = list;
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._heapify(i);
    }
  }

  /**
   * The number of elements in the heap
   *
   * @type {Number}
   */
  get length() {
    return this.heap.length;
  }

  /**
   * Insert a new element into the heap, maintaining the heap property.
   *
   * @param {*} value The value to insert
   * @returns {Number} The new size of the heap
   */
  push(value) {
    let index = this.heap.push(value) - 1;
    let check = true;
    while (check) {
      const parent = this._getParent(index);
      if (parent >= 0 && this._cmp(value, this.heap[parent])) {
        this._swap(index, parent);
        index = parent;
      }
      else {
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
    const min = this.heap.shift();
    if (typeof min === 'undefined') {
      return null;
    }
    if (this.heap.length) {
      // put the last element into the root position
      this.heap.unshift(this.heap.pop());
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
    return this.heap.indexOf(value) >= 0;
  }

  /**
   * Iteratively goes through tree, ensuring heap property is maintained,
   * correcting it if not.
   *
   * @private
   * @param {Number} i The index of what should be the largest node of a subtree
   */
  _heapify(i = 0) {
    // if this breaks the heap property, fix it. rinse and repeat until heap
    // property is true.
    const len = this.heap.length;
    let largest = i;
    this._getChildren(i).forEach((child) => {
      if (child < len && this._cmp(this.heap[child], this.heap[largest])) {
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
   * @param {Number} a First element to swap
   * @param {Number} b Second element to swap
   */
  _swap(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  /**
   * Gets the index of the parent of the given index in the heap-array.
   *
   * @private
   * @param {Number} index  The index of the child of which to find the parent.
   * @returns {Number} the parent index
   */
  _getParent(index) {
    return Math.floor((index - 1) / 2);
  }

  /**
   * Gets the indexes of the children of the node at the given index.
   *
   * @private
   * @param {Number} index  The index of the parent of which to find the
   * children.
   * @returns {Number[]} an array of the children indexes
   */
  _getChildren(index) {
    return [2 * index + 1, 2 * index + 2];
  }

  /**
   * Gets the min value of the heap (if your cmp function is a less-than
   * comparison).
   *
   * @returns {*} The min value
   */
  findMin() {
    return this.heap[0];
  }

  /**
   * Gets the max value of the heap (if your cmp function is a greater-than
   * comparison). (Functionally, identical to findMin -- included for semantic
   * reasons based on comparison function)
   *
   * @returns {*} The max value
   */
  findMax() {
    return this.heap[0];
  }
}
