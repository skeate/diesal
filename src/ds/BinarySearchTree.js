/**
 * A single node in the tree. Provides some useful computed properties.
 *
 * @property {*} value The value of the node
 * @property {?Node} parent The parent of the node
 * @property {?Node} left The left child of the node
 * @property {?Node} right The right child of the node
 */
class Node {
  /**
   * Create a node.
   *
   * @param {*} value The value of the node
   * @param {?Node} parent The parent of the node
   */
  constructor(value, parent = null) {
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  /**
   * The node that contains the lowest value in this node's subtree.
   *
   * @returns {Node}
   */
  get leftmostDescendant() {
    return this.left ? this.left.leftmostDescendant : this;
  }

  /**
   * The node that contains the highest value in this node's subtree.
   *
   * @returns {Node}
   */
  get rightmostDescendant() {
    return this.right ? this.right.rightmostDescendant : this;
  }
}

/**
 * A binary search tree is a container where each value is stored in a node, and
 * each node has two children: a left and a right. Values less than the value of
 * the node are put in the left child, and values greater than it are put in the
 * right child. In general, this results in O(log n) search, insertion, and
 * deletion, for only O(n) space.
 */
export default class BinarySearchTree {

  /**
   * @param {Array} [list] A list of initial values to insert into the tree.
   * @param {Function} [cmp] A comparison function taking two arguments and
   * returning a boolean. Defaults to `(a, b) => a < b`
   */
  constructor(list = [], cmp = (a, b) => a < b) {
    this._root = null;
    this._cmp = cmp;
    /**
     * @type {number}
     */
    this.length = 0;
    list.forEach(item => this.insert(item));
  }

  _insert(value, parent = this._root) {
    // Our tree has no nodes, so regardless of the value, it must be the _root.
    if (!this._root) {
      this._root = new Node(value);
      return ++this.length;
    }
    // Compare the value to the current parent's value. If it is lower, then it
    // should go on the left side.
    if (this._cmp(value, parent.value)) {
      // If the parent node doesn't have a left child, then we should put the
      // value there.
      if (parent.left === null) {
        parent.left = new Node(value, parent);
        return ++this.length;
      }
      // Otherwise, recurse, with the left value as the new parent.
      return this._insert(value, parent.left);
    } else if (parent.right === null) {
      // If it is greater than or equal to the value, then it should go on the
      // right side. Code is the same, but switch any 'left' with 'right'.
      parent.right = new Node(value, parent);
      return ++this.length;
    }
    return this._insert(value, parent.right);
  }

  /**
   * Inserts a value into the tree.
   *
   * @param {*} value The value to insert
   * @returns {number} The new size of the tree
   */
  insert(value) {
    return this._insert(value);
  }

  /**
   * Search for a value in the tree.
   *
   * @private
   * @param {*} value Value for which to search
   * @param {Node} node The current search _root
   * @return {?Node} null if not found, otherwise the node
   */
  _search(value, node = this._root) {
    // There are four possibilities:
    // 1. `node` is `null`: The value we're looking for isn't in the tree.
    // 2. `node.value` is `value`: We've found the value.
    // In both of these cases, we can simply return `node` -- in case 1, this
    // means it returns `null`, which is what we want if the value doesn't exist
    // in the tree.
    if (!node || node.value === value) {
      return node;
    }
    // 3. `value` is less than `node.value`: Search again, this time looking at
    //    only the values that are less than `node.value` (by looking at its
    //    left subtree)
    if (this._cmp(value, node.value)) {
      return this._search(value, node.left);
    }
    // 4. `value` is greater than `node.value`: Search again, this time looking
    //    at only the values that are greater than `node.value` (by looking at
    //    its right subtree)
    return this._search(value, node.right);
  }

  /**
   * Checks if the given value is in the tree.
   *
   * @param {*} value The value to check for
   * @returns {boolean} Whether or not the value is in the collection
   */
  contains(value) {
    return Boolean(this._search(value));
  }

  /**
   * Removes a value from the tree. If the value is in the tree multiple times,
   * it will remove the first one found.
   *
   * @param {*} value The value to remove.
   * @return {?number} The new length of the array (or null if no matching node
   * found)
   */
  remove(value) {
    // First, find the node.
    const node = this._search(value);
    // If it doesn't exist in the tree, we can exit.
    if (!node) {
      return null;
    }
    let _rootParent = null;
    if (node === this._root) {
      node.parent = { left: this._root };
      _rootParent = node.parent;
    }
    // If it has both left and right children, we need to do some extra work.
    // Find the next higher value (the right subtree's leftmost descendant),
    // swap out the values, and remove the other node.
    if (node.left && node.right) {
      const nextHigher = node.right.leftmostDescendant;
      node.value = nextHigher.value;
      // If the nextHigher node is the right child of its parent, replace it
      // with its own right children (if any). This can only happen if we had
      // a chain of only right children (or the node we're deleting only had one
      // right descendant)
      const nodeSide = nextHigher.parent.left === nextHigher ? 'left' : 'right';
      nextHigher.parent[nodeSide] = nextHigher.right;
      // Don't forget to reset parents
      if (nextHigher.right) {
        nextHigher.right.parent = nextHigher.parent;
      }
    } else {
      // If it only has one child, then we just replace it with its own child.
      // If it has no children, we can just remove it. This condition is rolled
      // into the final else, since with no children, `node.right` is `null`.
      const nodeSide = node.parent.left === node ? 'left' : 'right';
      if (node.left) {
        node.parent[nodeSide] = node.left;
        // Don't forget to reset parents
        node.left.parent = node.parent;
      } else {
        node.parent[nodeSide] = node.right;
        // Don't forget to reset parents
        if (node.right) {
          node.right.parent = node.parent;
        }
      }
    }
    if (_rootParent) {
      this._root = _rootParent.left;
    }
    return --this.length;
  }

  _toArray(node = this._root) {
    // An in-order traversal should (as you might expect) traverse the nodes in
    // value order. Since the tree is sorted so that smaller values go to the
    // left subtree, and larger values go to the right subtree, we want to visit
    // the left tree first, then include the current node itself, then all the
    // right subtree.
    let arr = [];
    if (node) {
      if (node.left) {
        arr = arr.concat(this._toArray(node.left));
      }
      arr = arr.concat(node.value);
      if (node.right) {
        arr = arr.concat(this._toArray(node.right));
      }
    }
    return arr;
  }

  /**
   * Converts the tree into an array using an in-order traversal of the tree.
   *
   * @returns {Array} The contents of the tree as a sorted array
   */
  toArray() {
    return this._toArray();
  }

  /**
   * Finds the immediate predecessor of the given value
   *
   * @param {*} value The value to find the predecessor for
   * @returns {*} Predecessor value, or null if value not found or min
   */
  getPredecessor(value) {
    return this._getNeighbor(value, true);
  }

  /**
   * Finds the immediate successor of the given value
   *
   * @param {*} value The value to find the successor for
   * @returns {*} Successor value, or null if value not found or max
   */
  getSuccessor(value) {
    return this._getNeighbor(value, false);
  }

  /**
   * Finds the immediate predecessor or successor of the given value
   *
   * @private
   * @param {*} value The value to find the predecessor or successor for
   * @param {boolean} findPredecessor Whether to find predecessor (true) or
   * successor (false)
   * @returns {*} The predecessor or successor
   */
  _getNeighbor(value, findPredecessor) {
    let foundNode = this._search(value);
    if (!foundNode) {
      return null;
    }
    let sideToCheck;
    let descendant;
    if (findPredecessor) {
      sideToCheck = 'left';
      descendant = 'rightmostDescendant';
    } else {
      sideToCheck = 'right';
      descendant = 'leftmostDescendant';
    }
    if (foundNode[sideToCheck]) {
      return foundNode[sideToCheck][descendant].value;
    }
    while (foundNode.parent && foundNode.parent[sideToCheck] === foundNode) {
      foundNode = foundNode.parent;
    }
    if (!foundNode.parent) {
      return null;
    }
    return foundNode.parent.value;
  }
}
