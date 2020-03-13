import { Heap } from '../Heap'

/** @test {Heap} */
describe('DS - Heap', () => {
  /** @test {Heap#constructor} */
  it('should be able to be instantiated', () => {
    expect(() => new Heap()).not.toThrow()
    expect(() => new Heap([1, 2, 3])).not.toThrow()
  })

  /** @test {Heap#size} */
  it('should have a size property', () => {
    const h = new Heap([1, 2, 3])
    expect(h.size).toEqual(3)
  })

  /** @test {Heap#push} */
  it('should allow insertion of new elements', () => {
    const h = new Heap([1, 2, 3])
    expect(h.push(7)).toEqual(4)
    expect(h.push(0)).toEqual(5)
    expect(h.push(4)).toEqual(6)
    expect(h.push(99)).toEqual(7)
  })

  /** @test {Heap#contains} */
  it('should check for existence of values', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9])
    expect(heap.contains(6)).toEqual(true)
    expect(heap.contains(2)).toEqual(false)
  })

  /**
   * @test {Heap#findMin}
   * @test {Heap#findMax}
   */
  it('should find the min', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9])
    expect(heap.findMin()).toEqual(1)
    expect(heap.findMax()).toEqual(1)
  })

  /** @test {Heap#pop} */
  it('should extract values, in order', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9])
    expect(heap.pop()).toEqual(1)
    expect(heap.pop()).toEqual(3)
    expect(heap.pop()).toEqual(5)
    expect(heap.pop()).toEqual(6)
    expect(heap.pop()).toEqual(7)
    expect(heap.pop()).toEqual(9)
    expect(heap.pop()).toBeNull()
  })

  /** @test {Heap#constructor} */
  it('should take a comparison function to determine sort order', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9], (a, b) => a > b)
    expect(heap.pop()).toEqual(9)
    expect(heap.pop()).toEqual(7)
    expect(heap.pop()).toEqual(6)
    expect(heap.pop()).toEqual(5)
    expect(heap.pop()).toEqual(3)
    expect(heap.pop()).toEqual(1)
    expect(heap.pop()).toBeNull()
  })
})
