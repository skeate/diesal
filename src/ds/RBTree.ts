import { HasParent } from './BinaryTree'
import { BinarySearchTree, Comparator } from './BinarySearchTree'
import { assert } from '../utils'

/**
 * A Red-Black Tree is a binary search tree that assigns a color to each node
 * (red or black; hence the name). In addition, it maintains these properties:
 *
 * 1. The root is black.
 * 2. Every leaf is black.
 * 3. If a node is red, then both its children are black.
 * 4. For each node, all simple paths from the node to its descendant leaves
 *    contain the same number of black nodes.
 *
 * These properties ensure that the tree is balanced (or close to it) -- in
 * other words, the number of children in the left branch of a node is going to
 * be approximately equal to the number of children in the right branch of the
 * node.
 *
 * Note: Property (2) is implicit; we do not actually create empty nodes and
 * mark them specifically as black in this implementation.
 */
export class RBTree<T> extends BinarySearchTree<T> {
  parent?: RBTree<T>
  left?: HasParent<RBTree<T>>
  right?: HasParent<RBTree<T>>

  protected isRed: boolean

  constructor(value: T, protected cmp: Comparator<T> = (a, b) => a < b) {
    super(value, cmp)
    this.isRed = false
  }

  get color() {
    if (this.isRed) return 'red'
    return 'black'
  }

  static fromArray<T>(arr: T[], cmp?: Comparator<T>): RBTree<T> | undefined {
    if (arr.length === 0) return undefined
    const root = new RBTree(arr[0], cmp)
    for (let i = 1; i < arr.length; i++) {
      root.insert(arr[i])
    }
    return root
  }

  prettyPrintValue(): string {
    if (this.isRed) return `\x1b[31m${this.value}\x1b[0m`
    return `${this.value}`
  }

  private rotateLeft(node: RBTree<T>): void {
    assert(node.right)
    // Shuffle around values to account for moving node
    const parentValue = node.value
    const parentRed = node.isRed
    const child = node.right
    node.right = child.right
    if (node.right) node.right.parent = node
    child.right = child.left
    child.left = node.left
    if (child.left) child.left.parent = child
    node.left = child
    node.value = child.value
    child.value = parentValue
    node.isRed = child.isRed
    child.isRed = parentRed
  }

  private rotateRight(node: RBTree<T>): void {
    assert(node.left)
    const parentValue = node.value
    const parentRed = node.isRed
    const child = node.left
    node.left = child.left
    if (node.left) node.left.parent = node
    child.left = child.right
    child.right = node.right
    if (child.right) child.right.parent = child
    node.right = child.withParent(node)
    node.value = child.value
    child.value = parentValue
    node.isRed = child.isRed
    child.isRed = parentRed
  }

  private insertFixup(newNode: RBTree<T>): RBTree<T> {
    let curNode: RBTree<T> = newNode
    let nodeInPlace: RBTree<T> = newNode

    while (curNode.parent?.parent && curNode.parent.isRed) {
      if (curNode.parent.isLeftChild) {
        const uncle = curNode.parent.parent.right
        if (uncle?.isRed) {
          curNode.parent.isRed = false
          uncle.isRed = false
          curNode.parent.parent.isRed = true
          curNode = curNode.parent.parent
        } else {
          if (curNode.isRightChild) {
            curNode = curNode.parent
            this.rotateLeft(curNode)
            if (curNode.left === nodeInPlace) nodeInPlace = curNode
            curNode = curNode.left!
          }
          assert(curNode.parent)
          assert(curNode.parent.parent)
          curNode.parent.isRed = false
          curNode.parent.parent.isRed = true
          this.rotateRight(curNode.parent.parent)
          if (curNode.parent.right === nodeInPlace) {
            nodeInPlace = curNode.parent
          }
        }
      } else {
        const uncle = curNode.parent.parent.left
        if (uncle?.isRed) {
          curNode.parent.isRed = false
          uncle.isRed = false
          curNode.parent.parent.isRed = true
          curNode = curNode.parent.parent
        } else {
          if (curNode.isLeftChild) {
            curNode = curNode.parent
            this.rotateRight(curNode)
            if (curNode.right === nodeInPlace) nodeInPlace = curNode
            curNode = curNode.right!
          }
          assert(curNode.parent)
          assert(curNode.parent.parent)
          curNode.parent.isRed = false
          curNode.parent.parent.isRed = true
          this.rotateLeft(curNode.parent.parent)
          if (curNode.parent.left === nodeInPlace) {
            nodeInPlace = curNode.parent
          }
        }
      }
    }
    this.isRed = false
    return nodeInPlace
  }

  insert(value: T): this {
    this.insertAndReturnNode(value)
    return this
  }

  insertAndReturnNode(value: T): RBTree<T> {
    const [node, side] = this.findParentAndSideFor(value)
    assert(node instanceof RBTree, 'Mixed tree types')
    const newNode = new RBTree(value, this.cmp).withParent(node)
    newNode.isRed = true
    node[side] = newNode
    return this.insertFixup(newNode)
  }

  protected transplant(a: RBTree<T>, b: undefined | RBTree<T>): void {
    if (!a.parent) {
      if (b) {
        this.isRed = b.isRed
        this.value = b.value
        this.left = b.left
        this.right = b.right
        b.parent = a.parent
      }
    } else if (a.isLeftChild) {
      a.parent.left = b?.withParent(a.parent)
    } else {
      a.parent.right = b?.withParent(a.parent)
    }
  }

  private deleteFixup(
    parent: RBTree<T> | undefined,
    side: 'left' | 'right',
  ): void {
    let curParent: RBTree<T> | undefined = parent
    let curSide = side
    while (curParent && !curParent[curSide]?.isRed) {
      if (curSide === 'left') {
        let w = curParent.right
        if (w?.isRed) {
          w.isRed = false
          curParent.isRed = true
          this.rotateLeft(curParent)
          curParent = curParent.left!
          w = curParent.right
        }
        assert(w)
        if (!w.left?.isRed && !w.right?.isRed) {
          w.isRed = true
          curSide = curParent?.isLeftChild ? 'left' : 'right'
          curParent = curParent.parent
        } else {
          if (!w.right?.isRed) {
            if (w.left) w.left.isRed = false
            w.isRed = true
            this.rotateRight(w)
            w = curParent.right
          }
          assert(w)
          w.isRed = curParent.isRed
          curParent.isRed = false
          if (w.right) w.right.isRed = false
          this.rotateLeft(curParent)
          curParent = undefined
          this.isRed = false
        }
      } else {
        let w = curParent.left
        if (w?.isRed) {
          w.isRed = false
          curParent.isRed = true
          this.rotateRight(curParent)
          curParent = curParent.right!
          w = curParent.left
        }
        assert(w, 'w must be defined')
        if (!w.right?.isRed && !w.left?.isRed) {
          w.isRed = true
          curSide = curParent.isLeftChild ? 'left' : 'right'
          curParent = curParent.parent
        } else {
          if (!w.left?.isRed) {
            if (w.right) w.right.isRed = false
            w.isRed = true
            this.rotateLeft(w)
            w = curParent.left
          }
          assert(w)
          w.isRed = curParent.isRed
          curParent.isRed = false
          if (w.left) w.left.isRed = false
          this.rotateRight(curParent)
          curParent = undefined
          this.isRed = false
        }
      }
    }
    if (curParent) {
      let curNode = curParent[curSide]
      if (curNode) curNode.isRed = false
    } else {
      this.isRed = false
    }
  }

  remove(value: T): RBTree<T> | undefined {
    const node = this.search(value)
    if (!node || !(node instanceof RBTree)) return this
    const nodel = node.left
    const noder = node.right
    const nodeir = node.isRed
    let curNode = node
    let curNodeOriginallyRed = curNode.isRed
    let xP: RBTree<T> | undefined
    let xS: 'left' | 'right' = 'left'
    if (!nodel) {
      xP = node === this ? undefined : node
      xS = 'right'
      if (!noder && !node.parent) {
        return undefined
      }
      if (!noder) {
        xP = node.parent
        xS = node.isLeftChild ? 'left' : 'right'
      }
      this.transplant(node, noder)
    } else if (!noder) {
      xP = node === this ? undefined : node
      xS = 'left'
      this.transplant(node, nodel)
    } else {
      curNode = noder.leftmostDescendant
      curNodeOriginallyRed = curNode.isRed
      xP = curNode
      xS = 'right'
      if (curNode.parent === node) {
        const x = xP[xS]
        if (x) x.parent = curNode
      } else {
        this.transplant(curNode, curNode.right)
        xP = curNode.parent
        xS = 'left'
        curNode.right = noder.withParent(curNode)
      }
      this.transplant(node, curNode)
      if (node === this) {
        this.left = nodel.withParent(this)
        if (curNode.right) this.right = curNode.right.withParent(this)
        this.isRed = nodeir
        if (xP === curNode) {
          xP = this
        }
      } else {
        curNode.left = nodel.withParent(curNode)
        curNode.isRed = nodeir
      }
    }
    if (!curNodeOriginallyRed) {
      this.deleteFixup(xP, xS)
    }
    return this
  }
}
