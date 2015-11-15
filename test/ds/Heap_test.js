import chai from 'chai';
let should = chai.should();

import Heap from '../../src/ds/Heap';

describe('DS - Heap', () => {
  it('should be able to be instantiated', () => {
    (() => new Heap()).should.not.throw();
    (() => new Heap([1,2,3])).should.not.throw();
  });

  it('should have a size property', () => {
    let h = new Heap([1,2,3]);
    h.length.should.equal(3);
  });

  it('should allow insertion of new elements', () => {
    let h = new Heap([1,2,3]);
    h.push(7).should.equal(4);
    h.push(0).should.equal(5);
    h.push(4).should.equal(6);
    h.push(99).should.equal(7);
  });

  it('should check for existence of values', () => {
    let heap = new Heap([5,3,1,7,6,9]);
    heap.contains(6).should.equal(true);
    heap.contains(2).should.equal(false);
  })

  it('should find the min', () => {
    let heap = new Heap([5,3,1,7,6,9]);
    heap.findMin().should.equal(1);
    heap.findMax().should.equal(1);
  });

  it('should extract values, in order', () => {
    let heap = new Heap([5,3,1,7,6,9]);
    heap.pop().should.equal(1);
    heap.pop().should.equal(3);
    heap.pop().should.equal(5);
    heap.pop().should.equal(6);
    heap.pop().should.equal(7);
    heap.pop().should.equal(9);
    should.equal(heap.pop(), null);

    let nums = [];
    let i = 0;
    const NUMS_LENGTH = 1000;
    while (i++ < NUMS_LENGTH) nums.push(Math.random());
    let h = new Heap(nums);
    let a;
    let b = h.pop();
    while(h.length) {
      a = b;
      b = h.pop();
      a.should.be.at.most(b);
    }
  });

  it('should take a comparison function to determine sort order', () => {
    let heap = new Heap([5,3,1,7,6,9], (a, b) => a > b);
    heap.pop().should.equal(9);
    heap.pop().should.equal(7);
    heap.pop().should.equal(6);
    heap.pop().should.equal(5);
    heap.pop().should.equal(3);
    heap.pop().should.equal(1);
    should.equal(heap.pop(), null);
  });
});
