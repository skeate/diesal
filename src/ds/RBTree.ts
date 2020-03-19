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
    // console.log('constructing ', value)
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
    // console.log(`rotating ${node.value} left`)
    // console.log('before')
    // console.log(this.toString())
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
    // console.log('after')
    // console.log(this.toString())
  }

  private rotateRight(node: RBTree<T>): void {
    // console.log(`rotating ${node.value} right`)
    // console.log('before')
    // console.log(this.toString())
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
    // console.log('after')
    // console.log(this.toString())
  }

  private insertFixup(newNode: RBTree<T>): void {
    let curNode: RBTree<T> = newNode
    // console.log('fixing up around ', newNode.value)

    while (curNode.parent?.parent && curNode.parent.isRed) {
      // console.log('current node:', curNode.prettyPrintValue())
      if (curNode.parent.isLeftChild) {
        // console.log('left parent')
        const uncle = curNode.parent.parent.right
        if (uncle?.isRed) {
          // console.log('case 1 (uncle is red)')
          curNode.parent.isRed = false
          uncle.isRed = false
          curNode.parent.parent.isRed = true
          curNode = curNode.parent.parent
        } else {
          if (curNode.isRightChild) {
            // console.log('case 2 (uncle is black, right child)')
            curNode = curNode.parent
            this.rotateLeft(curNode)
            curNode = curNode.left!
          }
          // console.log('case 3 (uncle is black, left child)')
          assert(curNode.parent)
          assert(curNode.parent.parent)
          curNode.parent.isRed = false
          curNode.parent.parent.isRed = true
          this.rotateRight(curNode.parent.parent)
        }
      } else {
        // console.log('right parent')
        const uncle = curNode.parent.parent.left
        if (uncle?.isRed) {
          // console.log('case 1 (uncle is red)')
          curNode.parent.isRed = false
          uncle.isRed = false
          curNode.parent.parent.isRed = true
          curNode = curNode.parent.parent
        } else {
          if (curNode.isLeftChild) {
            // console.log('case 2 (uncle is black, left child)')
            curNode = curNode.parent
            this.rotateRight(curNode)
            curNode = curNode.right!
          }
          // console.log('case 3 (uncle is black, right child)')
          assert(curNode.parent)
          assert(curNode.parent.parent)
          curNode.parent.isRed = false
          curNode.parent.parent.isRed = true
          this.rotateLeft(curNode.parent.parent)
        }
      }
    }
    this.isRed = false
  }

  insert(value: T): this {
    // console.log('inserting ', value)
    const [node, side] = this.findParentAndSideFor(value)
    assert(node instanceof RBTree, 'Mixed tree types')
    const newNode = new RBTree(value, this.cmp).withParent(node)
    newNode.isRed = true
    node[side] = newNode
    // console.log('pending insertFixup')
    // console.log(this.prettyPrint())
    this.insertFixup(newNode)
    // console.log('done inserting')
    // console.log(this.prettyPrint())
    return this
  }

  protected transplant(a: RBTree<T>, b: undefined | RBTree<T>): void {
    // console.log(`transplanting ${a.value} ${b?.value}`)
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
    // let curNode = parent[side]
    // console.log(`fixing up around ${parent?.prettyPrintValue()}'s ${side}`)
    // console.log('root\'s left:', this.left?.prettyPrintValue())
    while (curParent && !curParent[curSide]?.isRed) {
      // console.log(this.prettyPrint())
      if (curSide === 'left') {
        // console.log('left child')
        let w = curParent.right
        if (w?.isRed) {
          // console.log('case 1')
          w.isRed = false
          curParent.isRed = true
          this.rotateLeft(curParent)
          curParent = curParent.left!
          w = curParent.right
        }
        assert(w)
        if (!w.left?.isRed && !w.right?.isRed) {
          // console.log('case 2')
          w.isRed = true
          curSide = curParent?.isLeftChild ? 'left' : 'right'
          curParent = curParent.parent
        } else {
          if (!w.right?.isRed) {
            // console.log('case 3')
            if (w.left) w.left.isRed = false
            w.isRed = true
            this.rotateRight(w)
            w = curParent.right
          }
          // console.log('case 4')
          assert(w)
          w.isRed = curParent.isRed
          curParent.isRed = false
          if (w.right) w.right.isRed = false
          this.rotateLeft(curParent)
          curParent = undefined
          this.isRed = false
        }
      } else {
        // console.log('right child')
        let w = curParent.left
        // console.log('w is', w?.prettyPrintValue())
        if (w?.isRed) {
          // console.log('case 1')
          w.isRed = false
          curParent.isRed = true
          this.rotateRight(curParent)
          curParent = curParent.right!
          w = curParent.left
          // console.log(this.prettyPrint())
          // console.log('w is', w?.prettyPrintValue())
        }
        assert(w, 'w must be defined')
        if (!w.right?.isRed && !w.left?.isRed) {
          // console.log('case 2')
          w.isRed = true
          curSide = curParent.isLeftChild ? 'left' : 'right'
          curParent = curParent.parent
        } else {
          if (!w.left?.isRed) {
            // console.log('case 3')
            if (w.right) w.right.isRed = false
            w.isRed = true
            this.rotateLeft(w)
            w = curParent.left
          }
          // console.log('case 4')
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
    // console.log('removing', value)
    const node = this.search(value)
    if (!node || !(node instanceof RBTree)) return this
    // console.log('node found')
    const nodel = node.left
    const noder = node.right
    const nodeir = node.isRed
    let curNode = node
    let curNodeOriginallyRed = curNode.isRed
    let xP: RBTree<T> | undefined
    let xS: 'left' | 'right' = 'left'
    if (!nodel) {
      // console.log('node has no left child')
      xP = node === this ? undefined : node
      xS = 'right'
      if (!noder && !node.parent) {
        // console.log('removed last element in tree')
        return undefined
      }
      if (!noder) {
        // console.log('node has no right child')
        xP = node.parent
        xS = node.isLeftChild ? 'left' : 'right'
      }
      this.transplant(node, noder)
    } else if (!noder) {
      // console.log('node has left child')
      xP = node === this ? undefined : node
      xS = 'left'
      this.transplant(node, nodel)
    } else {
      // console.log('node has both children')
      curNode = noder.leftmostDescendant
      // console.log('swapping with', curNode.prettyPrintValue())
      curNodeOriginallyRed = curNode.isRed
      xP = curNode
      xS = 'right'
      if (curNode.parent === node) {
        // console.log('direct child')
        const x = xP[xS]
        if (x) x.parent = curNode
      } else {
        // console.log('indirect child')
        // console.log(curNode.parent)
        this.transplant(curNode, curNode.right)
        xP = curNode.parent
        xS = 'left'
        curNode.right = noder.withParent(curNode)
        // console.log(node.value, curNode.value, xP![xS])
        // console.log(this.prettyPrint())
      }
      this.transplant(node, curNode)
      if (node === this) {
        // console.log('found node is root')
        this.left = nodel.withParent(this)
        if (curNode.right) this.right = curNode.right.withParent(this)
        this.isRed = nodeir
        if (xP === curNode) {
          // console.log('swapped with child')
          xP = this
        }
      } else {
        // console.log('found node is not root')
        curNode.left = nodel.withParent(curNode)
        curNode.isRed = nodeir
      }
    }
    // console.log('before fixup')
    // console.log(this.prettyPrint())
    if (!curNodeOriginallyRed) {
      this.deleteFixup(xP, xS)
    }
    return this
  }
}
