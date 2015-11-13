import chai from 'chai';
let should = chai.should();

import BinarySearchTree from '../../src/ds/BinarySearchTree';

describe('BinarySearchTree', () => {
  it('should be able to be instantiated', () => {
    (() => new BinarySearchTree()).should.not.throw();
    (() => new BinarySearchTree([1,2,3])).should.not.throw();
  });

  it('should insert values', () => {
    let a = new BinarySearchTree([1,2,3]);
    a.length.should.equal(3);
    a.insert(0);
    a.length.should.equal(4);
    a.insert(-4);
    a.length.should.equal(5);
  });

  it('should convert into a sorted array', () => {
    let a = new BinarySearchTree([1, 5, 7, 4, 3, 7]);
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
  });

  it('should search for values', () => {
    let a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    should.not.equal(null, a.search(6));
    should.equal(null, a.search(2));
  });

  it('should find predecessor values', () => {
    let a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    should.equal(a.getPredecessor(1), null);
    a.getPredecessor(3).should.equal(1);
    a.getPredecessor(4).should.equal(3);
    a.getPredecessor(5).should.equal(4);
    a.getPredecessor(6).should.equal(5);
    a.getPredecessor(7).should.equal(6);
    a.getPredecessor(8).should.equal(7);
  });

  it('should find successor values', () => {
    let a = new BinarySearchTree([5, 3, 7, 1, 4, 6, 8]);
    should.equal(a.getSuccessor(8), null);
    a.getSuccessor(1).should.equal(3);
    a.getSuccessor(3).should.equal(4);
    a.getSuccessor(4).should.equal(5);
    a.getSuccessor(5).should.equal(6);
    a.getSuccessor(6).should.equal(7);
    a.getSuccessor(7).should.equal(8);
  });
});
