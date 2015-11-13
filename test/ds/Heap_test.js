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
    h.push(7);
    h.push(0);
    h.push(4);
    h.push(99);
    h.length.should.equal(7);
  });

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
});
