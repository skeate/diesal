import BinarySearchTree from '../BinarySearchTree';

/** @test {BinarySearchTree} */
describe('DS - BinarySearchTree', () => {
  /** @test {BinarySearchTree#constructor} */
  it('should be able to be instantiated', () => {
    expect(() => new BinarySearchTree()).not.toThrow();
    expect(() => new BinarySearchTree([1, 2, 3])).not.toThrow();
  });

  /** @test {BinarySearchTree#size} */
  it('should have a size property', () => {
    const h = new BinarySearchTree([1, 2, 3]);
    expect(h.size).toEqual(3);
  });

  /** @test {BinarySearchTree#insert} */
  it('should insert values', () => {
    const a = new BinarySearchTree([1, 2, 3]);
    expect(a.size).toEqual(3);
    a.insert(0);
    expect(a.size).toEqual(4);
    a.insert(-4);
    expect(a.size).toEqual(5);
  });

  /** @test {BinarySearchTree#remove} */
  it('should remove nodes', () => {
    /* This should generate a tree like
     *      5
     *    /   \
     *   3     7
     *  / \   / \
     * 1   4 6   8
     */
    let a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect([...a]).toEqual([1, 3, 4, 5, 6, 7, 8]);
    // no children
    a = a.remove(8);
    expect([...a]).toEqual([1, 3, 4, 5, 6, 7]);
    // left child only
    a = a.remove(7);
    expect([...a]).toEqual([1, 3, 4, 5, 6]);
    // both children
    a = a.remove(3);
    expect([...a]).toEqual([1, 4, 5, 6]);
    // need to remove some others to test right-only...
    a = a.remove(1);
    expect([...a]).toEqual([4, 5, 6]);
    a = a.remove(4);
    expect([...a]).toEqual([5, 6]);
    // right only
    a = a.remove(5);
    expect([...a]).toEqual([6]);
    a = a.remove(6);
    expect(a.value).toBeUndefined();
    // needed to test a few fringe cases
    a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 6.5, 8]);
    a = a.remove(5);
    expect([...a]).toEqual([1, 3, 4, 6, 6.5, 7, 8]);
  });

  /** @test {BinarySearchTree#contains} */
  it('should check for values being in the tree', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.contains(6)).toEqual(true);
    expect(a.contains(2)).toEqual(false);
  });

  /** @test {BinarySearchTree#getPredecessor} */
  it('should find predecessor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.getPredecessor(1)).toBeUndefined();
    expect(a.getPredecessor(2)).toBeUndefined();
    expect(a.getPredecessor(3)).toEqual(1);
    expect(a.getPredecessor(4)).toEqual(3);
    expect(a.getPredecessor(5)).toEqual(4);
    expect(a.getPredecessor(6)).toEqual(5);
    expect(a.getPredecessor(7)).toEqual(6);
    expect(a.getPredecessor(8)).toEqual(7);
  });

  /** @test {BinarySearchTree#getSuccessor} */
  it('should find successor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.getSuccessor(8)).toBeUndefined();
    expect(a.getSuccessor(2)).toBeUndefined();
    expect(a.getSuccessor(1)).toEqual(3);
    expect(a.getSuccessor(3)).toEqual(4);
    expect(a.getSuccessor(4)).toEqual(5);
    expect(a.getSuccessor(5)).toEqual(6);
    expect(a.getSuccessor(6)).toEqual(7);
    expect(a.getSuccessor(7)).toEqual(8);
  });

  /** @test {BinarySearchTree#constructor} */
  it('should take a comparison function to determine sort order', () => {
    const t = new BinarySearchTree([5, 3, 1, 7, 6, 9], (a, b) => a > b);
    expect([...t]).toEqual([9, 7, 6, 5, 3, 1]);
  });

  /** @test {BinarySearchTree#@@iterable} */
  describe('iterables', () => {
    const t = new BinarySearchTree([5, 3, 1, 7, 6, 9]);

    it('should default to inorder', () => {
      expect([...t]).toEqual([1, 3, 5, 6, 7, 9]);
    });

    it('should have an explicit inorder iterable', () => {
      expect([...t.inorder]).toEqual([1, 3, 5, 6, 7, 9]);
    });

    it('should have a reversed inorder iterable', () => {
      expect([...t.inorderReversed]).toEqual([9, 7, 6, 5, 3, 1]);
    });

    it('should have a preorder iterable', () => {
      expect([...t.preorder]).toEqual([5, 3, 1, 7, 6, 9]);
    });

    it('should have a right-to-left preorder iterable', () => {
      expect([...t.preorderReversed]).toEqual([5, 7, 9, 6, 3, 1]);
    });

    it('should have a postorder iterable', () => {
      debugger;
      expect([...t.postorder]).toEqual([1, 3, 6, 9, 7, 5]);
    });

    it('should have a right-to-left postorder iterable', () => {
      expect([...t.postorderReversed]).toEqual([9, 6, 7, 1, 3, 5]);
    });
  });
});
