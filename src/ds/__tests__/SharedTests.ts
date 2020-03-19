import { inorder } from '../../al/treeTraversals'
import { BinarySearchTree, Comparator } from '../BinarySearchTree'

export const SortedTreeTests = (
  Tree: (xs: number[], cmp?: Comparator<number>) => BinarySearchTree<number>,
) => {
  it('should be able to be instantiated', () => {
    expect(() => Tree([1, 2, 3])).not.toThrow()
  })

  it('should have a size property', () => {
    const h = Tree([1, 2, 3])
    expect(h.size).toEqual(3)
  })

  it('should insert values', () => {
    const a = Tree([1, 2, 3])
    expect(a.size).toEqual(3)
    a.insert(0)
    expect(a.size).toEqual(4)
    a.insert(-4)
    expect(a.size).toEqual(5)
  })

  it('should check for values being in the tree', () => {
    const a = Tree([5, 3, 7, 1, 4, 6, 8])
    expect(a.contains(6)).toEqual(true)
    expect(a.contains(2)).toEqual(false)
  })

  it('should find predecessor values', () => {
    const a = Tree([5, 3, 7, 1, 4, 6, 8])
    expect(a.getPredecessor(1)).toBeUndefined()
    expect(a.getPredecessor(2)).toBeUndefined()
    expect(a.getPredecessor(3)).toEqual(1)
    expect(a.getPredecessor(4)).toEqual(3)
    expect(a.getPredecessor(5)).toEqual(4)
    expect(a.getPredecessor(6)).toEqual(5)
    expect(a.getPredecessor(7)).toEqual(6)
    expect(a.getPredecessor(8)).toEqual(7)
  })

  it('should find successor values', () => {
    const a = Tree([5, 3, 7, 1, 4, 6, 8])
    expect(a.getSuccessor(8)).toBeUndefined()
    expect(a.getSuccessor(2)).toBeUndefined()
    expect(a.getSuccessor(1)).toEqual(3)
    expect(a.getSuccessor(3)).toEqual(4)
    expect(a.getSuccessor(4)).toEqual(5)
    expect(a.getSuccessor(5)).toEqual(6)
    expect(a.getSuccessor(6)).toEqual(7)
    expect(a.getSuccessor(7)).toEqual(8)
  })

  it('should take a comparison function to determine sort order', () => {
    const t = Tree([5, 3, 1, 7, 6, 9], (a, b) => a > b)
    expect([...inorder(t)]).toEqual([9, 7, 6, 5, 3, 1])
  })

  it('should handle very large trees', () => {
    const tree = Tree([...Array(20000)].map(i => i + 1))
    tree.remove(20000)
  })
}
