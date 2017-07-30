import BinarySearchTree from '../BinarySearchTree';

describe('DS - BinarySearchTree', () => {
  it('should be able to be instantiated', () => {
    expect(() => new BinarySearchTree()).not.toThrow();
    expect(() => new BinarySearchTree([1, 2, 3])).not.toThrow();
  });

  it('should insert values', () => {
    const a = new BinarySearchTree([1, 2, 3]);
    expect(a.length).toEqual(3);
    a.insert(0);
    expect(a.length).toEqual(4);
    a.insert(-4);
    expect(a.length).toEqual(5);
  });

  it('should convert into a sorted array', () => {
    const a = new BinarySearchTree([1, 5, 7, 4, 3, 7]);
    expect(a.toArray()).toEqual([1, 3, 4, 5, 7, 7]);
  });

  it('should remove nodes', () => {
    /* This should generate a tree like
     *      5
     *    /   \
     *   3     7
     *  / \   / \
     * 1   4 6   8
     */
    let a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.toArray()).toEqual([1, 3, 4, 5, 6, 7, 8]);
    // no children
    a.remove(8);
    expect(a.toArray()).toEqual([1, 3, 4, 5, 6, 7]);
    // left child only
    a.remove(7);
    expect(a.toArray()).toEqual([1, 3, 4, 5, 6]);
    // both children
    a.remove(3);
    expect(a.toArray()).toEqual([1, 4, 5, 6]);
    // need to remove some others to test right-only...
    a.remove(1);
    expect(a.toArray()).toEqual([4, 5, 6]);
    a.remove(4);
    expect(a.toArray()).toEqual([5, 6]);
    // right only
    a.remove(5);
    expect(a.toArray()).toEqual([6]);
    a.remove(6);
    expect(a.toArray()).toEqual([]);
    // check removal of non-existant element
    a.remove(6);
    expect(a.toArray()).toEqual([]);
    // needed to test a few fringe cases
    a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 6.5, 8]);
    a.remove(5);
    expect(a.toArray()).toEqual([1, 3, 4, 6, 6.5, 7, 8]);
  });

  it('should check for values being in the tree', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.contains(6)).toEqual(true);
    expect(a.contains(2)).toEqual(false);
  });

  it('should find predecessor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.getPredecessor(1)).toBeNull();
    expect(a.getPredecessor(2)).toBeNull();
    expect(a.getPredecessor(3)).toEqual(1);
    expect(a.getPredecessor(4)).toEqual(3);
    expect(a.getPredecessor(5)).toEqual(4);
    expect(a.getPredecessor(6)).toEqual(5);
    expect(a.getPredecessor(7)).toEqual(6);
    expect(a.getPredecessor(8)).toEqual(7);
  });

  it('should find successor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    expect(a.getSuccessor(8)).toBeNull();
    expect(a.getSuccessor(2)).toBeNull();
    expect(a.getSuccessor(1)).toEqual(3);
    expect(a.getSuccessor(3)).toEqual(4);
    expect(a.getSuccessor(4)).toEqual(5);
    expect(a.getSuccessor(5)).toEqual(6);
    expect(a.getSuccessor(6)).toEqual(7);
    expect(a.getSuccessor(7)).toEqual(8);
  });

  it('should take a comparison function to determine sort order', () => {
    const t = new BinarySearchTree([5, 3, 1, 7, 6, 9], (a, b) => a > b);
    expect(t.toArray()).toEqual([9, 7, 6, 5, 3, 1]);
  });
});
