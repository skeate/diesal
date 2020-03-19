import * as fc from 'fast-check'

import { inorder } from '../../al/treeTraversals'
import { RBTree } from '../RBTree'

import { SortedTreeTests } from './SharedTests'

expect.extend({
  toMaintainInvariants(tree: RBTree<unknown>): jest.CustomMatcherResult {
    let message = ''
    if (tree.color !== 'black') {
      message = 'expected root of tree to be black'
    } else {
      let expectedBlackCount = 1
      let curNode = tree
      while (curNode.left) {
        if (curNode.left.color === 'black') expectedBlackCount++
        curNode = curNode.left
      }
      const toVisit: [RBTree<unknown>, number, RBTree<unknown>[]][] = [
        [tree, 0, []],
      ]
      while (toVisit.length) {
        const [node, blackAncestors, nodes] = toVisit.pop()
        const blacks = blackAncestors + (node.color === 'black' ? 1 : 0)
        const nodeHistory = [...nodes, node]
        if (node.color === 'red') {
          let failSide = ''
          if (node.left?.color === 'red') {
            failSide = 'left side'
          }
          if (node.right?.color === 'red') {
            failSide = failSide ? 'both sides' : 'right side'
          }
          if (failSide) {
            message =
              'expected all children of red nodes to be black. ' +
              `exception found at ${failSide} of ${nodeHistory
                .map(n => n.prettyPrintValue())
                .join('->')}`
          }
        }

        if (!node.left && !node.right && blacks !== expectedBlackCount) {
          message =
            'expected all paths from root to leaf to have the same number of black nodes. ' +
            `leftmost path has ${expectedBlackCount} but path (${nodeHistory
              .map(n => n.prettyPrintValue())
              .join('->')}) has ${blacks}\n` +
            tree.prettyPrint()
        }

        if (message) {
          break
        }

        if (node.right) toVisit.push([node.right, blacks, nodeHistory])
        if (node.left) toVisit.push([node.left, blacks, nodeHistory])
      }
    }

    if (message) {
      return {
        pass: false,
        message: () => message,
      }
    }
    return {
      pass: true,
      message: () => 'expected tree not to maintain red-black tree invariants',
    }
  },
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toMaintainInvariants(): R
    }
  }
}

describe('BinarySearchTree', () => {
  SortedTreeTests((list, cmp) => RBTree.fromArray(list, cmp))

  it('should handle very, very large trees', () => {
    const tree = RBTree.fromArray([...Array(2000000)].map(i => i + 1))
    tree.remove(2000000)
  })

  it('should remove nodes', () => {
    /* This should generate a tree like
     *      5
     *    /   \
     *   3     7
     *  / \   / \
     * 1   4 6   8
     */
    let a = RBTree.fromArray([5, 3, 7, 1, 4, 6, 8])
    expect([...inorder(a)]).toEqual([1, 3, 4, 5, 6, 7, 8])
    // no children
    a = a.remove(8)
    expect([...inorder(a)]).toEqual([1, 3, 4, 5, 6, 7])
    // left child only
    a = a.remove(7)
    expect([...inorder(a)]).toEqual([1, 3, 4, 5, 6])
    // both children
    a = a.remove(3)
    expect([...inorder(a)]).toEqual([1, 4, 5, 6])
    // need to remove some others to test right-only...
    a = a.remove(1)
    expect([...inorder(a)]).toEqual([4, 5, 6])
    a = a.remove(4)
    expect([...inorder(a)]).toEqual([5, 6])
    // right only
    a = a.remove(5)
    expect([...inorder(a)]).toEqual([6])
    a = a.remove(6)
    expect(a).toBeUndefined()
    // needed to test a few fringe cases
    a = RBTree.fromArray([5, 3, 7, 1, 4, 6, 6.5, 8])
    a = a.remove(5)
    expect([...inorder(a)]).toEqual([1, 3, 4, 6, 6.5, 7, 8])
  })

  it('should be able to give the node inserted', () => {
    fc.assert(
      fc.property(fc.set(fc.integer(-100, 100), 2, 20), nums => {
        const numToInsert = nums[0]
        const tree = RBTree.fromArray(nums.slice(1))
        const node = tree.insertAndReturnNode(numToInsert)
        expect(node.value).toEqual(numToInsert)
      }),
    )
  })

  it('should maintain the invariants through arbitrary inserts/deletes', () => {
    type Model = number[]
    type Real = RBTree<number>

    class Insert implements fc.Command<Model, Real> {
      constructor(readonly value: number) {}
      toString = () => `insert(${this.value})`
      check = () => true
      run(m: Model, r: Real) {
        m.push(this.value)
        m.sort((a, b) => a - b)
        r.insert(this.value)
        expect(r).toMaintainInvariants()
      }
    }
    class Remove implements fc.Command<Model, Real> {
      constructor(readonly value: number) {}
      toString = () => `remove(${this.value})`
      check(m: Readonly<Model>) {
        return m.length > 1 || (m.length === 1 && m[0] !== this.value)
      }
      run(m: Model, r: Real) {
        const found = m.indexOf(this.value)
        if (found >= 0) m.splice(found, 1)
        r.remove(this.value)
        expect(r).toMaintainInvariants()
      }
    }

    const allCommands = [
      fc.integer(-100, 100).map(v => new Insert(v)),
      fc.integer(-100, 100).map(v => new Remove(v)),
    ]
    fc.assert(
      fc.property(fc.commands(allCommands, 100), cmds => {
        const s = () => ({ model: [], real: new RBTree(0) })
        fc.modelRun(s, cmds)
      }),
    )
  })
})
