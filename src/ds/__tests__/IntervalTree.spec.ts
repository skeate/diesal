import * as fc from 'fast-check'
import { IntervalTree } from '../IntervalTree'

describe('DS - IntervalTree', () => {
  it('should be able to be instantiated', () => {
    expect(() => new IntervalTree()).not.toThrow()
  })

  it('should have a size property', () => {
    const h = new IntervalTree()
    expect(h.size).toBe(0)
  })

  it('should allow insertion of new intervals', () => {
    const intervalTree = new IntervalTree()
    intervalTree.insert(0, 3, 'a')
    intervalTree.insert(1, 4, 'b')
    intervalTree.insert(2, 5, 'c')
    expect(intervalTree.size).toEqual(3)
  })

  it('should find matching intervals', () => {
    const intervalTree = new IntervalTree()
    expect(intervalTree.lookup(1)).toEqual([])
    intervalTree.insert(0, 3, 'a')
    intervalTree.insert(1, 4, 'b')
    intervalTree.insert(2, 5, 'c')
    expect(intervalTree.lookup(1).sort()).toEqual(['a', 'b'])
    expect(intervalTree.lookup(4).sort()).toEqual(['b', 'c'])
    expect(intervalTree.lookup(5)).toEqual(['c'])
    expect(intervalTree.lookup(8)).toEqual([])
    intervalTree.insert(0, 10, 'd')
    expect(intervalTree.lookup(8)).toEqual(['d'])
  })

  it('should find overlapping intervals', () => {
    const intervalTree = new IntervalTree()
    expect(intervalTree.overlap(0, 1)).toEqual([])
    intervalTree.insert(2, 4, 'a')
    intervalTree.insert(2, 5, 'b')
    intervalTree.insert(4, 6, 'c')
    expect(intervalTree.overlap(0, 1).sort()).toEqual([])
    expect(intervalTree.overlap(1, 2).sort()).toEqual(['a', 'b'])
    expect(intervalTree.overlap(2, 3).sort()).toEqual(['a', 'b'])
    expect(intervalTree.overlap(3, 4).sort()).toEqual(['a', 'b', 'c'])
    expect(intervalTree.overlap(4, 5).sort()).toEqual(['a', 'b', 'c'])
    expect(intervalTree.overlap(5, 6).sort()).toEqual(['b', 'c'])
    expect(intervalTree.overlap(6, 7).sort()).toEqual(['c'])
    expect(intervalTree.overlap(7, 8).sort()).toEqual([])
    expect(intervalTree.overlap(2, 6).sort()).toEqual(['a', 'b', 'c'])
    expect(intervalTree.overlap(0, 8).sort()).toEqual(['a', 'b', 'c'])

    const intervalTreeB = new IntervalTree()
    intervalTreeB.insert(2, 4, 'a')
    intervalTreeB.insert(2, 3, 'b')
    expect(intervalTreeB.overlap(0, 2).sort()).toEqual(['a', 'b'])

    const intervalTreeC = new IntervalTree()
    intervalTreeC.insert(2, 5, 'a')
    intervalTreeC.insert(2, 3, 'b')
    intervalTreeC.insert(4, 6, 'c')
    expect(intervalTreeC.overlap(0, 5).sort()).toEqual(['a', 'b', 'c'])
    expect(intervalTreeC.overlap(3, 5).sort()).toEqual(['a', 'b', 'c'])

    const intervalTreeD = new IntervalTree()
    intervalTreeD.insert(0, 4, 'a')
    intervalTreeD.insert(3, 4, 'b')
    intervalTreeD.insert(1, 2, 'c')
    expect(intervalTreeD.overlap(0, 2).sort()).toEqual(['a', 'c'])
  })

  it('should work for randomly generated trees', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer(-100, 100),
          fc.array(
            fc
              .tuple(fc.integer(-100, 100), fc.integer(-100, 100))
              .map(t => (t[0] < t[1] ? t : [t[1], t[0]])),
            5,
            100,
          ),
        ),
        ([needle, tups]) => {
          const tree = new IntervalTree()
          tups.forEach(tup => {
            tree.insert(tup[0], tup[1], tup)
          })
          const sorter = (a: number[], b: number[]) =>
            a[0] - b[0] || a[1] - b[1]
          const matchingTups = tups
            .filter(t => needle >= t[0] && needle <= t[1])
            .sort(sorter)
          expect(tree.lookup(needle).sort(sorter)).toEqual(matchingTups)
        },
      ),
    )
  })

  it('should handle very large trees', () => {
    const intervalTree = new IntervalTree()
    for (let i = 0; i < 50000; i++) {
      intervalTree.insert(i, i + i, i)
    }
  })
})
