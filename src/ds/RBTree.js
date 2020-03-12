import BinarySearchTree, { Node } from "./BinarySearchTree";

export class ColoredNode extends Node {
  /**
   * Create a node.
   *
   * @param {*} value The value of the node
   * @param {boolean} red Color of current node (red = true, black = false)
   * @param {?Node} parent The parent of the node
   */
  constructor(value, red, parent = null) {
    super(value, parent);
    this.red = red;
  }
}

/**
  * A red-black tree 
export default class RBTree extends BinarySearchTree {
  _insert(value, parent = this._root) {

  }
}
