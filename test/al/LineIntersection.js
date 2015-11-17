import chai from 'chai';
import lineIntersection from '../../src/al/LineIntersection';
const should = chai.should();

describe('AL - Line Intersection (Euclidean)', () => {
  it('should handle line intersections', () => {
    lineIntersection(
      {x: 1, y: 0},
      {x: 1, y: 2},
      {x: 0, y: 1},
      {x: 2, y: 1}
    ).should.deep.equal({x: 1, y: 1});
  });

  it('should handle line intersections not on segments', () => {
    should.equal(null, lineIntersection(
      {x: 1, y: 1},
      {x: 2, y: 2},
      {x: 0, y: 0},
      {x: 1, y: 0}
    ));
    should.equal(null, lineIntersection(
      {x: 0, y: 0},
      {x: 2, y: 2},
      {x: 2, y: 0},
      {x: 1.5, y: 0.5}
    ));
  });

  it('should handle overlap on endpoints', () => {
    should.equal(null, lineIntersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 2}
    ));
  });

  it('should handle parallel lines', () => {
    should.equal(null, lineIntersection(
      {x: 0, y: 0},
      {x: 0, y: 3},
      {x: 1, y: 0},
      {x: 1, y: 3}
    ));
  });

  it('should handle partial overlaps', () => {
    lineIntersection(
      {x: 0, y: 0},
      {x: 2, y: 2},
      {x: 1, y: 1},
      {x: 3, y: 3}
    ).should.deep.equal([
      {x: 1, y: 1},
      {x: 2, y: 2},
    ]);
    lineIntersection(
      {x: 1, y: 1},
      {x: 3, y: 3},
      {x: 0, y: 0},
      {x: 2, y: 2}
    ).should.deep.equal([
      {x: 1, y: 1},
      {x: 2, y: 2},
    ]);
  });

  it('should handle total overlaps', () => {
    lineIntersection(
      {x: 0, y: 0},
      {x: 3, y: 3},
      {x: 1, y: 1},
      {x: 2, y: 2}
    ).should.deep.equal([
      {x: 1, y: 1},
      {x: 2, y: 2},
    ]);
  });
});
