// @ts-nocheck

/**
 * A node in the interval tree.
 *
 * @property {number} low Start of the interval
 * @property {number} high End of the interval
 * @property {number} min The lowest endpoint of this node's interval or any of
 * its children.
 * @property {number} max The greatest endpoint of this node's interval or any
 * of its children.
 * @property {*} data The value of the interval
 * @property {IntervalTreeNode?} left Left child (lower intervals)
 * @property {IntervalTreeNode?} right Right child (higher intervals)
 * @property {IntervalTreeNode?} parent The parent of this node
 * @private
 */
class IntervalTreeNode {
  constructor(low, high, data, parent) {
    this.low = low
    this.high = high
    this.min = low
    this.max = high
    this.data = data
    this.left = null
    this.right = null
    this.parent = parent
  }
}

/**
 * An interval tree is a data structure that holds intervals. For example, if
 * you had events which took place over a period of time, you might store them
 * in an interval tree where the interval is their duration.
 *
 * It allows you to find all intervals which contain a specific point, or
 * overlap with a given interval.
 */
export class IntervalTree {
  /**
   * Constructs an empty interval tree.
   */
  constructor() {
    this._root = null
    /** @type {number} */
    this.size = 0
  }

  /**
   * Actually insert a new interval into the tree. This has a few extra
   * arguments that don't really need to be exposed in the public API, hence the
   * separation.
   *
   * @private
   * @param {number} begin Start of the interval
   * @param {number} end End of the interval
   * @param {*} value The value of the interval
   * @param {IntervalTreeNode?} node The current place we are looking at to add
   * the interval
   * @param {IntervalTreeNode?} parent The parent of the place we are looking to
   * add the interval
   * @param {string} parentSide The side of the parent we're looking at
   * @returns {IntervalTreeNode} The newly added node
   */
  _insert(begin, end, value, node, parent, parentSide) {
    // The natural implementation of this is recursive; however, this prevents
    // particularly large trees from working due to callstack constraints.
    // Instead, we use an iterative algorithm, and keep track of the chain of
    // ancestors so we can update their `max` values.
    const nodeStack = []
    let foundParent = parent
    let foundSide = parentSide
    if (node !== null) {
      // No vacancies. Figure out which side we should be putting our interval,
      // and then dive into that node.
      let curNode = node
      while (curNode) {
        nodeStack.push(curNode)
        foundSide =
          begin < curNode.low || (begin === curNode.low && end < curNode.high)
            ? 'left'
            : 'right'
        foundParent = curNode
        curNode = curNode[foundSide]
      }
    }
    // The place we're looking at is available; let's put our node here.
    const newNode = new IntervalTreeNode(begin, end, value, parent)
    if (foundParent === null) {
      // No parent? Must be root.
      this._root = newNode
    } else {
      // Let the parent know about its new child
      foundParent[foundSide] = newNode
    }
    let childNode = newNode
    // Update the max values.
    while (nodeStack.length) {
      const parentNode = nodeStack.pop()
      const prevMax = parentNode.max
      const prevMin = parentNode.min
      parentNode.max = Math.max(parentNode.max, childNode.max)
      parentNode.min = Math.min(parentNode.min, childNode.min)
      if (parentNode.max === prevMax && parentNode.min === prevMin) {
        // we won't update any further nodes, so we can stop the loop early
        break
      }
      childNode = parentNode
    }

    return newNode
  }

  /**
   * Insert a new value into the tree, for the given interval.
   *
   * @param {number} begin The start of the valid interval
   * @param {number} end The end of the valid interval
   * @param {*} value The value for the interval
   */
  insert(begin, end, value) {
    this._insert(begin, end, value, this._root, this._root)
    this.size++
  }

  _lookup(point, node = this._root) {
    const overlaps = []
    if (node === null || node.max < point) {
      return overlaps
    }
    overlaps.push(...this._lookup(point, node.left))
    if (node.low <= point) {
      if (node.high >= point) {
        overlaps.push(node.data)
      }
      overlaps.push(...this._lookup(point, node.right))
    }
    return overlaps
  }

  /**
   * Find all intervals that cover a certain point.
   *
   * @param {number} point The sought point
   * @returns {*[]} An array of all values that are valid at the given point.
   */
  lookup(point) {
    return this._lookup(point)
  }

  _overlap(begin, end, node = this._root) {
    const overlaps = []
    if (!(begin > node.high || node.low > end)) {
      overlaps.push(node.data)
    }
    if (node.left && node.left.max >= begin) {
      overlaps.push(...this._overlap(begin, end, node.left))
    }
    if (node.right && node.right.min <= end) {
      overlaps.push(...this._overlap(begin, end, node.right))
    }
    return overlaps
  }

  /**
   * Find all intervals that overlap a certain interval.
   *
   * @param {number} begin The start of the valid interval
   * @param {number} end The end of the valid interval
   * @returns {*[]} An array of all values that overlap the given interval.
   */
  overlap(begin, end) {
    return this._overlap(begin, end)
  }
}
