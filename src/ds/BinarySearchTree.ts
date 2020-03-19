import { assert } from '../utils'

import { BinaryTree, HasParent } from './BinaryTree'

export type Comparator<T> = (a: T, b: T) => boolean

/**
 * A binary search tree is a tree where each node has (at most) two children and
 * the values are sorted. Note that this does not necessarily mean the tree is
 * _balanced_ (see `RBTree` for that), so in the worst case you could have a
 * tree whose depth is the same as its size, meaning worse performance than a
 * simple list.
 */
export class BinarySearchTree<T> extends BinaryTree<T> {
  parent?: BinarySearchTree<T>
  left?: HasParent<BinarySearchTree<T>>
  right?: HasParent<BinarySearchTree<T>>

  constructor(value: T, protected cmp: Comparator<T> = (a, b) => a < b, protected eq: Comparator<T> = (a, b) => a === b) {
    super(value)
  }

  static fromArray<T>(
    arr: T[],
    cmp?: Comparator<T>,
    eq?: Comparator<T>,
  ): BinarySearchTree<T> | undefined {
    if (arr.length === 0) return undefined
    const root = new BinarySearchTree(arr[0], cmp, eq)
    for (let i = 1; i < arr.length; i++) {
      root.insert(arr[i])
    }
    return root;
  }

  findParentAndSideFor(value: T): [BinarySearchTree<T>, 'left' | 'right'] {
    let curNode: BinarySearchTree<T> = this
    while (true) {
      if (this.cmp(value, curNode.value)) {
        if (curNode.left) curNode = curNode.left
        else return [curNode, 'left']
      } else {
        if (curNode.right) curNode = curNode.right
        else return [curNode, 'right']
      }
    }
  }

  insert(value: T): this {
    const [node, side] = this.findParentAndSideFor(value)
    node[side] = new BinarySearchTree(value, this.cmp, this.eq).withParent(node)
    return this
  }

  /**
   * Search for a value in the tree.
   */
  search(value: T): BinarySearchTree<T> | undefined {
    let curNode: BinarySearchTree<T> | undefined = this
    while (curNode && typeof curNode.value !== 'undefined') {
      if (this.eq(curNode.value, value)) return curNode
      if (this.cmp(value, curNode.value)) curNode = curNode.left
      else curNode = curNode.right
    }
    return undefined
  }

  /**
   * Checks if the given value is in the tree.
   *
   * @param {*} value The value to check for
   * @returns {boolean} Whether or not the value is in the collection
   */
  contains(value: T): boolean {
    return Boolean(this.search(value))
  }

  /**
   * Removes a value from the tree. If the value is in the tree multiple times,
   * it will remove the first one found.
   */
  remove(value: T): BinarySearchTree<T> | undefined {
    // First, find the node.
    const node = this.search(value)
    // If it doesn't exist in the tree, we can exit.
    if (!node) {
      return this
    }
    // If the node to be removed is the root node, we need a temporary parent as
    // a placeholder for the impending node shuffle.
    let rootParent = null
    if (node === this && !this.parent) {
      this.parent = new BinarySearchTree(this.value, this.cmp, this.eq)
      this.parent.left = this.withParent(this.parent)
      rootParent = this.parent
    }
    assert(node.parent !== undefined)
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
      const successor = node.right.leftmostDescendant
      node.value = successor.value
      const successorParent = successor.parent
      // If the successor node is the right child of its parent, replace it
      // with its own right children (if any). This can only happen if the
      // successor is the direct child of the node being removed.
      const nodeSide = successorParent.left === successor ? 'left' : 'right'
      successorParent[nodeSide] = successor.right
      if (successor.right) {
        successor.right.parent = successorParent
      }
    } else {
      // If it only has one child, then we just replace it with its own child.
      // If it has no children, we can just remove it. This condition is rolled
      // into the final else, since with no children, `node.right` is `null`.
      const nodeParent = node.parent
      const nodeSide = nodeParent.left === node ? 'left' : 'right'
      if (node.left) {
        nodeParent[nodeSide] = node.left
        // Don't forget to reset parents
        node.left.parent = node.parent
      } else {
        nodeParent[nodeSide] = node.right
        // Don't forget to reset parents
        if (node.right) {
          node.right.parent = node.parent
        }
      }
    }
    if (rootParent) {
      if (rootParent.left) {
        return rootParent.left.withoutParent()
      }
      return undefined
    }
    return this
  }

  /**
   * Finds the immediate predecessor of the given value
   */
  getPredecessor(value: T): T | undefined {
    return this.getNeighbor(value, true)
  }

  /**
   * Finds the immediate successor of the given value
   */
  getSuccessor(value: T): T | undefined {
    return this.getNeighbor(value, false)
  }

  /**
   * Finds the immediate predecessor or successor of the given value
   */
  private getNeighbor(value: T, findPredecessor: boolean): T | undefined {
    let foundNode = this.search(value)
    if (!foundNode) {
      return undefined
    }
    let sideToCheck: 'left' | 'right'
    let descendant: 'leftmostDescendant' | 'rightmostDescendant'
    if (findPredecessor) {
      sideToCheck = 'left'
      descendant = 'rightmostDescendant'
    } else {
      sideToCheck = 'right'
      descendant = 'leftmostDescendant'
    }
    if (foundNode[sideToCheck]) {
      return (foundNode[sideToCheck] as BinarySearchTree<T>)[descendant].value
    }
    while (
      foundNode &&
      foundNode.parent &&
      foundNode.parent[sideToCheck] === foundNode
    ) {
      foundNode = foundNode.parent
    }
    if (!foundNode.parent) {
      return undefined
    }
    return foundNode.parent.value
  }
}
