import chai from 'chai';
import Heap from '../../src/ds/Heap';

const should = chai.should();

describe('DS - Heap', () => {
  it('should be able to be instantiated', () => {
    (() => new Heap()).should.not.throw();
    (() => new Heap([1, 2, 3])).should.not.throw();
  });

  it('should have a size property', () => {
    const h = new Heap([1, 2, 3]);
    h.length.should.equal(3);
  });

  it('should allow insertion of new elements', () => {
    const h = new Heap([1, 2, 3]);
    h.push(7).should.equal(4);
    h.push(0).should.equal(5);
    h.push(4).should.equal(6);
    h.push(99).should.equal(7);
  });

  it('should check for existence of values', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9]);
    heap.contains(6).should.equal(true);
    heap.contains(2).should.equal(false);
  });

  it('should find the min', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9]);
    heap.findMin().should.equal(1);
    heap.findMax().should.equal(1);
  });

  it('should extract values, in order', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9]);
    heap.pop().should.equal(1);
    heap.pop().should.equal(3);
    heap.pop().should.equal(5);
    heap.pop().should.equal(6);
    heap.pop().should.equal(7);
    heap.pop().should.equal(9);
    should.equal(heap.pop(), null);
  });

  it('should take a comparison function to determine sort order', () => {
    const heap = new Heap([5, 3, 1, 7, 6, 9], (a, b) => a > b);
    heap.pop().should.equal(9);
    heap.pop().should.equal(7);
    heap.pop().should.equal(6);
    heap.pop().should.equal(5);
    heap.pop().should.equal(3);
    heap.pop().should.equal(1);
    should.equal(heap.pop(), null);
  });
});
