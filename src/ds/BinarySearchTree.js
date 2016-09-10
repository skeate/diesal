/**
 * A single node in the tree. Provides some useful computed properties.
 *
 * @private
 */
export class BSTNode {
  constructor(value, parent = null) {
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  /**
   * The node that contains the lowest value in this node's subtree.
   */
  get leftmostDescendant() {
    return this.left ? this.left.leftmostDescendant : this;
  }

  /**
   * The node that contains the highest value in this node's subtree.
   */
  get rightmostDescendant() {
    return this.right ? this.right.rightmostDescendant : this;
  }
}

/**
 * A binary search tree.
 */
export default class BinarySearchTree {

  /**
   * @param {Array} [list] A list of initial values to insert into the tree.
   * @param {Function} [cmp] A comparison function taking two arguments and
   * returning a boolean. Defaults to `(a, b) => a < b`
   */
  constructor(list = [], cmp = (a, b) => a < b) {
    this.root = null;
    this.cmp = cmp;
    this.length = 0;
    list.forEach((item) => this.insert(item));
  }

  /**
   * Inserts a value into the tree.
   *
   * @param {*} value The value to insert
   * @returns {number} The new size of the tree
   */
  insert(value) {
    const parent = arguments.length > 1 ? arguments[1] : this.root;
    // Our tree has no nodes, so regardless of the value, it must be the root.
    if (!this.root) {
      this.root = new BSTNode(value);
      return ++this.length;
    }
    // Compare the value to the current parent's value. If it is lower, then it
    // should go on the left side.
    if (this.cmp(value, parent.value)) {
      // If the parent node doesn't have a left child, then we should put the
      // value there.
      if (parent.left === null) {
        parent.left = new BSTNode(value, parent);
        return ++this.length;
      }
      // Otherwise, recurse, with the left value as the new parent.
      return this.insert(value, parent.left);
    }
    // If it is greater than or equal to the value, then it should go on the
    // right side. Code is the same, but switch any 'left' with 'right'.
    else if (parent.right === null) {
      parent.right = new BSTNode(value, parent);
      return ++this.length;
    }
    return this.insert(value, parent.right);
  }

  /**
   * Search for a value in the tree.
   *
   * @private
   * @param {*} value Value for which to search
   * @param {BSTNode} node The current search root
   * @return {?BSTNode} null if not found, otherwise the node
   */
  _search(value, node = this.root) {
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
    if (this.cmp(value, node.value)) {
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
   * @returns {Boolean} Whether or not the value is in the collection
   */
  contains(value) {
    return Boolean(this._search(value));
  }

  /**
   * Removes a value from the tree. If the value is in the tree multiple times,
   * it will remove the first one found.
   *
   * @param {*} value The value to remove.
   * @return {?Number} The new length of the array (or null if no matching node
   * found)
   */
  remove(value) {
    // First, find the node.
    const node = this._search(value);
    // If it doesn't exist in the tree, we can exit.
    if (!node) {
      return null;
    }
    let rootParent = null;
    if (node === this.root) {
      rootParent = node.parent = {left: this.root};
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
    }
    else {
      // If it only has one child, then we just replace it with its own child.
      // If it has no children, we can just remove it. This condition is rolled
      // into the final else, since with no children, `node.right` is `null`.
      const nodeSide = node.parent.left === node ? 'left' : 'right';
      if (node.left) {
        node.parent[nodeSide] = node.left;
        // Don't forget to reset parents
        node.left.parent = node.parent;
      }
      else {
        node.parent[nodeSide] = node.right;
        // Don't forget to reset parents
        if (node.right) {
          node.right.parent = node.parent;
        }
      }
    }
    if (rootParent) {
      this.root = rootParent.left;
    }
    return --this.length;
  }

  /**
   * Converts the tree into an array using an in-order traversal of the tree.
   *
   * @returns {Array} The contents of the tree as a sorted array
   */
  toArray() {
    // An in-order traversal should (as you might expect) traverse the nodes in
    // value order. Since the tree is sorted so that smaller values go to the
    // left subtree, and larger values go to the right subtree, we want to visit
    // the left tree first, then include the current node itself, then all the
    // right subtree.
    const node = arguments.length === 0 ? this.root : arguments[0];
    let arr = [];
    if (node) {
      if (node.left) {
        arr = arr.concat(this.toArray(node.left));
      }
      arr = arr.concat(node.value);
      if (node.right) {
        arr = arr.concat(this.toArray(node.right));
      }
    }
    return arr;
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
   * @param {Boolean} findPredecessor Whether to find predecessor (true) or
   * successor (false)
   * @returns {*} The predecessor or successor
   */
  _getNeighbor(value, findPredecessor) {
    let foundNode = this._search(value);
    if (!foundNode) {
      return null;
    }
    let sideToCheck, descendant;
    if (findPredecessor) {
      sideToCheck = 'left';
      descendant = 'rightmostDescendant';
    }
    else {
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
