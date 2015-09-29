/**
 * A binary heap implementation. Note that in all descriptions, where we use
 * "min", it really depends on what your comparison function is. The default is
 * a min function.
 *
 * @class Heap
 */
export default class Heap {
  /**
   * @constructor
   * @param {Array} list A list of initial entries into the heap (default: `[]`)
   * @param {Function} cmp A function to compare elements in the heap (default:
   * `(a, b) => a < b`)
   */
  constructor(list = [], cmp = (a, b) => a < b) {
    this._cmp = cmp;
    this.heap = list;
    this._heapify();
  }

  get length() {
    return this.heap.length;
  }

  /**
   * Insert a new element into the heap, maintaining the heap property.
   *
   * @param {*} value The value to insert
   * @returns {undefined}
   */
  push(value) {
    let index = this.heap.push(value) - 1;
    let check = true;
    while (check) {
      let parent = this._getParent(index);
      if (this._cmp(value, this.heap[parent])) {
        this._swap(index, parent);
        index = parent;
      } else {
        check = false;
      }
    }
  }

  /**
   * Gets the min value and removes it from the heap, adjusting everything else
   * in the heap to maintain heap property, then returns the value.
   *
   * @returns {*} the min value in the heap.
   */
  pop() {
    // remove and store lowest value
    const min = this.heap.shift();
    if (typeof min === 'undefined') {
      return null;
    }
    // put the last element into the root position
    this.heap.unshift(this.heap.pop());
    this._heapify();
    return min;
  }

  /**
   * Iteratively goes through tree, ensuring heap property is maintained,
   * correcting it if not.
   *
   * @private
   * @returns {undefined}
   */
  _heapify() {
    // if this breaks the heap property, fix it. rinse and repeat until heap
    // property is true.
    let i = 0;
    const v = this.heap[i];
    while (true) {
      let children = this._getChildren(i);
      if (children[0] >= this.heap.length) {
        break;
      }
      let leftChild = this.heap[children[0]];
      let rightChild, useLeftChild;
      if (children[1] >= this.heap.length) {
        useLeftChild = true;
      }
      else {
        rightChild = this.heap[children[1]];
        // we want to compare it to the min child, so find out what that is first
        useLeftChild = this._cmp(leftChild, rightChild);
      }
      const needToSwap = this._cmp(useLeftChild ? leftChild : rightChild, v);
      if (needToSwap) {
        let swapChildIndex = children[useLeftChild ? 0 : 1];
        this._swap(swapChildIndex, i);
        i = swapChildIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Swaps two indexes in the heap.
   *
   * @private
   * @param {Number} a First element to swap
   * @param {Number} b Second element to swap
   * @returns {undefined}
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
   * @returns {Array<Number>} an array of the children indexes
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
