import { BinarySearchTree } from '../../ds/BinarySearchTree'
import { inorder, preorder, postorder } from '../treeTraversals'

describe('iterables', () => {
  const t = BinarySearchTree.fromArray([5, 3, 1, 7, 6, 9])

  it('should have an inorder iterable', () => {
    expect([...inorder(t)]).toEqual([1, 3, 5, 6, 7, 9])
  })

  it('should have a reversed inorder iterable', () => {
    expect([...inorder(t, true)]).toEqual([9, 7, 6, 5, 3, 1])
  })

  it('should have a preorder iterable', () => {
    expect([...preorder(t)]).toEqual([5, 3, 1, 7, 6, 9])
  })

  it('should have a right-to-left preorder iterable', () => {
    expect([...preorder(t, true)]).toEqual([5, 7, 9, 6, 3, 1])
  })

  it('should have a postorder iterable', () => {
    debugger
    expect([...postorder(t)]).toEqual([1, 3, 6, 9, 7, 5])
  })

  it('should have a right-to-left postorder iterable', () => {
    expect([...postorder(t, true)]).toEqual([9, 6, 7, 1, 3, 5])
  })
})
