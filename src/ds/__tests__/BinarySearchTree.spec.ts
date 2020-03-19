import { inorder } from '../../al/treeTraversals'
import { BinarySearchTree } from '../BinarySearchTree'

import { SortedTreeTests } from './SharedTests'

describe('BinarySearchTree', () => {
  SortedTreeTests((list, cmp) => BinarySearchTree.fromArray(list, cmp))

  it('should remove nodes', () => {
    /* This should generate a tree like
     *      5
     *    /   \
     *   3     7
     *  / \   / \
     * 1   4 6   8
     */
    let a = BinarySearchTree.fromArray([5, 3, 7, 1, 4, 6, 8])
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
    a = BinarySearchTree.fromArray([5, 3, 7, 1, 4, 6, 6.5, 8])
    a = a.remove(5)
    expect([...inorder(a)]).toEqual([1, 3, 4, 6, 6.5, 7, 8])
  })
})
