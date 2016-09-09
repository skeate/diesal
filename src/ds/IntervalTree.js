
/**
 * A node in the interval tree.
 *
 * @property {Number} low Start of the interval
 * @property {Number} high End of the interval
 * @property {Number} min The lowest endpoint of this node's interval or any of
 * its children.
 * @property {Number} max The greatest endpoint of this node's interval or any
 * of its children.
 * @property {*} data The value of the interval
 * @property {IntervalTreeNode?} left Left child (lower intervals)
 * @property {IntervalTreeNode?} right Right child (higher intervals)
 * @property {IntervalTreeNode?} parent The parent of this node
 * @private
 */
class IntervalTreeNode {
  constructor(low, high, data, parent) {
    this.low = low;
    this.high = high;
    this.min = low;
    this.max = high;
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = parent;
  }
}

export default class IntervalTree {
  constructor() {
    this._root = null;
    this.size = 0;
  }

  /**
   * Actually insert a new interval into the tree. This has a few extra
   * arguments that don't really need to be exposed in the public API, hence the
   * separation.
   *
   * @private
   * @param {Number} begin Start of the interval
   * @param {Number} end End of the interval
   * @param {*} value The value of the interval
   * @param {IntervalTreeNode?} node The current place we are looking at to add
   * the interval
   * @param {IntervalTreeNode?} parent The parent of the place we are looking to
   * add the interval
   * @param {String} parentSide The side of the parent we're looking at
   * @returns {IntervalTreeNode} The newly added node
   */
  _insert(begin, end, value, node, parent, parentSide) {
    let newNode;
    if (node === null) {
      // The place we're looking at is available; let's put our node here.
      newNode = new IntervalTreeNode(begin, end, value, parent);
      if (parent === null) {
        // No parent? Must be root.
        this._root = newNode;
      }
      else {
        // Let the parent know about its new child
        parent[parentSide] = newNode;
      }
    }
    else {
      // No vacancies. Figure out which side we should be putting our interval,
      // and then recurse.
      const side = (begin < node.low || begin === node.low && end < node.high)
        ? 'left'
        : 'right';
      newNode = this._insert(begin, end, value, node[side], node, side);
      node.max = Math.max(node.max, newNode.max);
      node.min = Math.min(node.min, newNode.min);
    }
    return newNode;
  }

  /**
   * Insert a new value into the tree, for the given interval.
   *
   * @param {Number} begin The start of the valid interval
   * @param {Number} end The end of the valid interval
   * @param {*} value The value for the interval
   */
  insert(begin, end, value) {
    this._insert(begin, end, value, this._root, this._root);
    this.size++;
  }

  /**
   * Find all intervals that cover a certain point.
   *
   * @param {Number} point The sought point
   * @returns {*[]} An array of all values that are valid at the given point.
   */
  lookup(point) {
    const overlaps = [];
    let node = this._root;
    if (arguments.length === 2) {
      node = arguments[1];
    }
    if (node === null || node.max < point) {
      return overlaps;
    }
    overlaps.push(...this.lookup(point, node.left));
    if (node.low <= point) {
      if (node.high >= point) {
        overlaps.push(node.data);
      }
      overlaps.push(...this.lookup(point, node.right));
    }
    return overlaps;
  }

  /**
   * Find all intervals that overlap a certain interval.
   *
   * @param {Number} begin The start of the valid interval
   * @param {Number} end The end of the valid interval
   * @returns {*[]} An array of all values that overlap the given interval.
   */
  overlap(begin, end) {
    const overlaps = [];
    let node = this._root;
    if (arguments.length === 3) {
      node = arguments[2];
    }
    if (!(begin > node.high || node.low > end)) {
      overlaps.push(node.data);
    }
    if (node.left && node.left.max >= begin) {
      overlaps.push(...this.overlap(begin, end, node.left));
    }
    if (node.right && node.right.min <= end) {
      overlaps.push(...this.overlap(begin, end, node.right));
    }
    return overlaps;
  }
}
