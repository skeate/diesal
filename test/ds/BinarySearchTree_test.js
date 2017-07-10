import chai from 'chai';
import BinarySearchTree from '../../src/ds/BinarySearchTree';

const should = chai.should();

describe('DS - BinarySearchTree', () => {
  it('should be able to be instantiated', () => {
    (() => new BinarySearchTree()).should.not.throw();
    (() => new BinarySearchTree([1, 2, 3])).should.not.throw();
  });

  it('should insert values', () => {
    const a = new BinarySearchTree([1, 2, 3]);
    a.length.should.equal(3);
    a.insert(0);
    a.length.should.equal(4);
    a.insert(-4);
    a.length.should.equal(5);
  });

  it('should convert into a sorted array', () => {
    const a = new BinarySearchTree([1, 5, 7, 4, 3, 7]);
    a.toArray().should.deep.equal([1, 3, 4, 5, 7, 7]);
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
    a.toArray().should.deep.equal([1, 3, 4, 5, 6, 7, 8]);
    // no children
    a.remove(8);
    a.toArray().should.deep.equal([1, 3, 4, 5, 6, 7]);
    // left child only
    a.remove(7);
    a.toArray().should.deep.equal([1, 3, 4, 5, 6]);
    // both children
    a.remove(3);
    a.toArray().should.deep.equal([1, 4, 5, 6]);
    // need to remove some others to test right-only...
    a.remove(1);
    a.toArray().should.deep.equal([4, 5, 6]);
    a.remove(4);
    a.toArray().should.deep.equal([5, 6]);
    // right only
    a.remove(5);
    a.toArray().should.deep.equal([6]);
    a.remove(6);
    a.toArray().should.deep.equal([]);
    // check removal of non-existant element
    a.remove(6);
    a.toArray().should.deep.equal([]);
    // needed to test a few fringe cases
    a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 6.5, 8]);
    a.remove(5);
    a.toArray().should.deep.equal([1, 3, 4, 6, 6.5, 7, 8]);
  });

  it('should check for values being in the tree', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    a.contains(6).should.equal(true);
    a.contains(2).should.equal(false);
  });

  it('should find predecessor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    should.equal(a.getPredecessor(1), null);
    should.equal(a.getPredecessor(2), null);
    a.getPredecessor(3).should.equal(1);
    a.getPredecessor(4).should.equal(3);
    a.getPredecessor(5).should.equal(4);
    a.getPredecessor(6).should.equal(5);
    a.getPredecessor(7).should.equal(6);
    a.getPredecessor(8).should.equal(7);
  });

  it('should find successor values', () => {
    const a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    should.equal(a.getSuccessor(8), null);
    should.equal(a.getSuccessor(2), null);
    a.getSuccessor(1).should.equal(3);
    a.getSuccessor(3).should.equal(4);
    a.getSuccessor(4).should.equal(5);
    a.getSuccessor(5).should.equal(6);
    a.getSuccessor(6).should.equal(7);
    a.getSuccessor(7).should.equal(8);
  });

  it('should take a comparison function to determine sort order', () => {
    const t = new BinarySearchTree([5, 3, 1, 7, 6, 9], (a, b) => a > b);
    t.toArray().should.deep.equal([9, 7, 6, 5, 3, 1]);
  });
});
