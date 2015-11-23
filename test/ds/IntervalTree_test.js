import chai from 'chai';
chai.should();

import IntervalTree from '../../src/ds/IntervalTree';

describe('DS - IntervalTree', () => {
  it('should be able to be instantiated', () => {
    (() => new IntervalTree()).should.not.throw();
  });

  it('should allow insertion of new intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(0, 3, 'a');
    intervalTree.insert(1, 4, 'b');
    intervalTree.insert(2, 5, 'c');
    intervalTree.size.should.equal(3);
  });

  it('should find matching intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(0, 3, 'a');
    intervalTree.insert(1, 4, 'b');
    intervalTree.insert(2, 5, 'c');
    intervalTree.lookup(1).should.deep.equal(['a', 'b']);
    intervalTree.lookup(4).should.deep.equal(['b', 'c']);
    intervalTree.lookup(5).should.deep.equal(['c']);
    intervalTree.lookup(8).should.deep.equal([]);
    intervalTree.insert(0, 10, 'd');
    intervalTree.lookup(8).should.deep.equal(['d']);
  });
});
