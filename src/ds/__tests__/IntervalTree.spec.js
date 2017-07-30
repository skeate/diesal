import IntervalTree from '../IntervalTree';

/** @test {IntervalTree} */
describe('DS - IntervalTree', () => {
  /** @test {IntervalTree#constructor} */
  it('should be able to be instantiated', () => {
    expect(() => new IntervalTree()).not.toThrow();
  });

  /** @test {IntervalTree#size} */
  it('should have a size property', () => {
    const h = new IntervalTree();
    expect(h.size).toBe(0);
  });

  /** @test {IntervalTree#insert} */
  it('should allow insertion of new intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(0, 3, 'a');
    intervalTree.insert(1, 4, 'b');
    intervalTree.insert(2, 5, 'c');
    expect(intervalTree.size).toEqual(3);
  });

  /** @test {IntervalTree#lookup} */
  it('should find matching intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(0, 3, 'a');
    intervalTree.insert(1, 4, 'b');
    intervalTree.insert(2, 5, 'c');
    expect(intervalTree.lookup(1)).toEqual(['a', 'b']);
    expect(intervalTree.lookup(4)).toEqual(['b', 'c']);
    expect(intervalTree.lookup(5)).toEqual(['c']);
    expect(intervalTree.lookup(8)).toEqual([]);
    intervalTree.insert(0, 10, 'd');
    expect(intervalTree.lookup(8)).toEqual(['d']);
  });

  /** @test {IntervalTree#overlap} */
  it('should find overlapping intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(2, 4, 'a');
    intervalTree.insert(2, 5, 'b');
    intervalTree.insert(4, 6, 'c');
    expect(intervalTree.overlap(0, 1)).toEqual([]);
    expect(intervalTree.overlap(1, 2)).toEqual(['a', 'b']);
    expect(intervalTree.overlap(2, 3)).toEqual(['a', 'b']);
    expect(intervalTree.overlap(3, 4)).toEqual(['a', 'b', 'c']);
    expect(intervalTree.overlap(4, 5)).toEqual(['a', 'b', 'c']);
    expect(intervalTree.overlap(5, 6)).toEqual(['b', 'c']);
    expect(intervalTree.overlap(6, 7)).toEqual(['c']);
    expect(intervalTree.overlap(7, 8)).toEqual([]);
    expect(intervalTree.overlap(2, 6)).toEqual(['a', 'b', 'c']);
    expect(intervalTree.overlap(0, 8)).toEqual(['a', 'b', 'c']);

    const intervalTreeB = new IntervalTree();
    intervalTreeB.insert(2, 4, 'a');
    intervalTreeB.insert(2, 3, 'b');
    expect(intervalTreeB.overlap(0, 2)).toEqual(['a', 'b']);

    const intervalTreeC = new IntervalTree();
    intervalTreeC.insert(2, 5, 'a');
    intervalTreeC.insert(2, 3, 'b');
    intervalTreeC.insert(4, 6, 'c');
    expect(intervalTreeC.overlap(0, 5)).toEqual(['a', 'b', 'c']);
    expect(intervalTreeC.overlap(3, 5)).toEqual(['a', 'b', 'c']);

    const intervalTreeD = new IntervalTree();
    intervalTreeD.insert(0, 4, 'a');
    intervalTreeD.insert(3, 4, 'b');
    intervalTreeD.insert(1, 2, 'c');
    expect(intervalTreeD.overlap(0, 2)).toEqual(['a', 'c']);
  });
});
