import chai from 'chai';
import IntervalTree from '../../src/ds/IntervalTree';

chai.should();

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

  it('should find overlapping intervals', () => {
    const intervalTree = new IntervalTree();
    intervalTree.insert(2, 4, 'a');
    intervalTree.insert(2, 5, 'b');
    intervalTree.insert(4, 6, 'c');
    intervalTree.overlap(0, 1).should.deep.equal([]);
    intervalTree.overlap(1, 2).should.deep.equal(['a', 'b']);
    intervalTree.overlap(2, 3).should.deep.equal(['a', 'b']);
    intervalTree.overlap(3, 4).should.deep.equal(['a', 'b', 'c']);
    intervalTree.overlap(4, 5).should.deep.equal(['a', 'b', 'c']);
    intervalTree.overlap(5, 6).should.deep.equal(['b', 'c']);
    intervalTree.overlap(6, 7).should.deep.equal(['c']);
    intervalTree.overlap(7, 8).should.deep.equal([]);
    intervalTree.overlap(2, 6).should.deep.equal(['a', 'b', 'c']);
    intervalTree.overlap(0, 8).should.deep.equal(['a', 'b', 'c']);

    const intervalTreeB = new IntervalTree();
    intervalTreeB.insert(2, 4, 'a');
    intervalTreeB.insert(2, 3, 'b');
    intervalTreeB.overlap(0, 2).should.deep.equal(['a', 'b']);

    const intervalTreeC = new IntervalTree();
    intervalTreeC.insert(2, 5, 'a');
    intervalTreeC.insert(2, 3, 'b');
    intervalTreeC.insert(4, 6, 'c');
    intervalTreeC.overlap(0, 5).should.deep.equal(['a', 'b', 'c']);
    intervalTreeC.overlap(3, 5).should.deep.equal(['a', 'b', 'c']);

    const intervalTreeD = new IntervalTree();
    intervalTreeD.insert(0, 4, 'a');
    intervalTreeD.insert(3, 4, 'b');
    intervalTreeD.insert(1, 2, 'c');
    intervalTreeD.overlap(0, 2).should.deep.equal(['a', 'c']);
  });

  it('should handle very large trees', () => {
    const intervalTree = new IntervalTree();
    for (let i = 0; i < 50000; i++) {
      intervalTree.insert(i, i + i, i);
    }
  });
});
