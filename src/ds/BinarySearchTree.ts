import { assert } from "../utils";

import { BinaryTree, HasParent } from "./BinaryTree";

export type Comparator<T> = (a: T, b: T) => boolean;

/**
 * A binary search tree is a tree where each node has (at most) two children and
 * the values are sorted. Note that this does not necessarily mean the tree is
 * _balanced_ (see `RBTree` for that), so in the worst case you could have a
 * tree whose depth is the same as its size, meaning worse performance than a
 * simple list.
 */
export default class BinarySearchTree<T> extends BinaryTree<T> {
  parent?: BinarySearchTree<T>;
  left?: HasParent<BinarySearchTree<T>>;
  right?: HasParent<BinarySearchTree<T>>;

  constructor(list: T[] = [], private cmp: Comparator<T> = (a, b) => a < b) {
    super();
    for (const el of list) {
      this.insert(el);
    }
  }

  insert(value: T): this {
    if (this.value === undefined) {
      this.value = value;
    } else if (this.cmp(value, this.value)) {
      if (this.left) {
        this.left.insert(value);
      } else {
        this.left = new BinarySearchTree([value], this.cmp).withParent(this);
      }
    } else {
      if (this.right) {
        this.right.insert(value);
      } else {
        this.right = new BinarySearchTree([value], this.cmp).withParent(this);
      }
    }
    return this;
  }

  /**
   * Search for a value in the tree.
   */
  search(value: T): BinarySearchTree<T> | undefined {
    if (this.value === value) {
      return this;
    }
    if (this.value) {
      const onLeftSide = this.cmp(value, this.value);
      if (onLeftSide && this.left) {
        return this.left.search(value);
      } else if (!onLeftSide && this.right) {
        return this.right.search(value);
      }
    }
    return undefined;
  }

  /**
   * Checks if the given value is in the tree.
   *
   * @param {*} value The value to check for
   * @returns {boolean} Whether or not the value is in the collection
   */
  contains(value: T): boolean {
    return Boolean(this.search(value));
  }

  /**
   * Removes a value from the tree. If the value is in the tree multiple times,
   * it will remove the first one found.
   */
  remove(value: T): BinarySearchTree<T> {
    // First, find the node.
    const node = this.search(value);
    // If it doesn't exist in the tree, we can exit.
    if (!node) {
      return this;
    }
    // If the node to be removed is the root node, we need a temporary parent as
    // a placeholder for the impending node shuffle.
    let rootParent = null;
    if (node === this && !this.parent) {
      this.parent = new BinarySearchTree();
      this.parent.left = this.withParent(this.parent);
      rootParent = this.parent;
    }
    assert(node.parent !== undefined);
    // If it has both left and right children, we need to do some extra work.
    // Find the next higher value (the right subtree's leftmost descendant),
    // swap out the values, and remove the other node.
    //    (D)               (S)
    //   /  \     =>       /  \
    // (L)  (R)          (L)  (R)
    //     /  \              /  \
    //  (S)   (E)          (C)  (E)
    //     \
    //    (C)
    if (node.left && node.right) {
      const successor = node.right.leftmostDescendant;
      node.value = successor.value;
      const successorParent = successor.parent;
      // If the successor node is the right child of its parent, replace it
      // with its own right children (if any). This can only happen if the
      // successor is the direct child of the node being removed.
      const nodeSide = successorParent.left === successor ? "left" : "right";
      successorParent[nodeSide] = successor.right;
      if (successor.right) {
        successor.right.parent = successorParent;
      }
    } else {
      // If it only has one child, then we just replace it with its own child.
      // If it has no children, we can just remove it. This condition is rolled
      // into the final else, since with no children, `node.right` is `null`.
      const nodeParent = node.parent as BinarySearchTree<T>;
      const nodeSide = nodeParent.left === node ? "left" : "right";
      if (node.left) {
        nodeParent[nodeSide] = node.left;
        // Don't forget to reset parents
        node.left.parent = node.parent;
      } else {
        nodeParent[nodeSide] = node.right;
        // Don't forget to reset parents
        if (node.right) {
          node.right.parent = node.parent;
        }
      }
    }
    if (rootParent) {
      if (rootParent.left) {
        return rootParent.left.withoutParent();
      }
      return rootParent;
    }
    return this;
  }

  /**
   * Finds the immediate predecessor of the given value
   */
  getPredecessor(value: T): T | undefined {
    return this.getNeighbor(value, true);
  }

  /**
   * Finds the immediate successor of the given value
   */
  getSuccessor(value: T): T | undefined {
    return this.getNeighbor(value, false);
  }

  /**
   * Finds the immediate predecessor or successor of the given value
   */
  private getNeighbor(value: T, findPredecessor: boolean): T | undefined {
    let foundNode = this.search(value);
    if (!foundNode) {
      return undefined;
    }
    let sideToCheck: "left" | "right";
    let descendant: "leftmostDescendant" | "rightmostDescendant";
    if (findPredecessor) {
      sideToCheck = "left";
      descendant = "rightmostDescendant";
    } else {
      sideToCheck = "right";
      descendant = "leftmostDescendant";
    }
    if (foundNode[sideToCheck]) {
      return (foundNode[sideToCheck] as BinarySearchTree<T>)[descendant].value;
    }
    while (
      foundNode &&
      foundNode.parent &&
      foundNode.parent[sideToCheck] === foundNode
    ) {
      foundNode = foundNode.parent;
    }
    if (!foundNode.parent) {
      return undefined;
    }
    return foundNode.parent.value;
  }
}
