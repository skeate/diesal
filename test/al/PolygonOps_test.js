import chai from 'chai';
chai.should();

import {
  combineShapes,
  union,
  intersection,
  difference,
} from '../../src/al/PolygonOps';

describe('AL - Polygon boolean operations', () => {
  const eq = (a, b) => a.x === b.x && a.y === b.y;
  const toString = (p) => `(${p.x}, ${p.y})`;
  const shapesMatch = (actualShapes, expectedShapes) => {
    if (actualShapes.length !== expectedShapes.length) {
      const actualPolygons = actualShapes.map((s) => `[${s.map(toString)}]`);
      throw new Error(
        `Number of polygons do not match:
        actual   = ${actualShapes.length},
        expected = ${expectedShapes.length}
        actual polygons: ${actualPolygons}`
      );
    }
    actualShapes.forEach((actualShape, i) => {
      const expectedShape = expectedShapes[i];
      if (actualShape.length !== expectedShape.length) {
        throw new Error(
          `Number of points in ${i + 1}th polygon does not match:
          actual   = ${actualShape.length},
          expected = ${expectedShape.length}
          actual points: ${actualShape.map(toString)}`
        );
      }
      let counter = actualShape.length;
      while (counter-- && !eq(actualShape[0], expectedShape[0])) {
        actualShape.push(actualShape.shift());
      }
      if (counter === -1) {
        throw new Error(
          `Expected point not found: ${toString(expectedShape[0])}`
        );
      }
      actualShape.forEach((p, j) => {
        p.should.deep.equal(expectedShape[j]);
      });
    });
  };
  const square = [
    {x: 0, y: 0},
    {x: 2, y: 0},
    {x: 2, y: 2},
    {x: 0, y: 2},
  ];
  const shiftedSquare = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 3, y: 3},
    {x: 1, y: 3},
  ];
  const smallSquare = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 0, y: 1},
  ];
  const smallShiftedSquare = [
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 2, y: 2},
    {x: 1, y: 2},
  ];
  const rectangle = [
    {x: 0, y: 1},
    {x: 1, y: 1},
    {x: 1, y: 3},
    {x: 0, y: 3},
  ];
  const shiftedRectangle = [
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 2, y: 3},
    {x: 1, y: 3},
  ];

  describe('on Euclidean geometry', () => {
    describe('intersecting shapes', () => {
      /* Shapes will look like
       *   ┌───┐
       * ┌─┼─┐ │
       * │ └─┼─┘
       * └───┘
       * So combined, should be
       *  UNION        INTERSECTION     DIFFERENCE
       *   ┌───┐
       * ┌─┘   │           ┌─┐           ┌─┐
       * │   ┌─┘           └─┘           │ └─┐
       * └───┘                           └───┘
       */
      const combinations = combineShapes(square, shiftedSquare);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 3, y: 3},
          {x: 3, y: 1},
          {x: 2, y: 1},
          {x: 2, y: 0},
          {x: 0, y: 0},
          {x: 0, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 3},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, [[
          {x: 1, y: 1},
          {x: 1, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 1},
        ]]);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 0},
          {x: 0, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 1},
          {x: 2, y: 1},
          {x: 2, y: 0},
        ]]);
      });
    });

    describe('partially overlapping shapes', () => {
      /* Shapes will look like
       *   ┌─┐
       * ┌─┼─┧
       * │ └─┦
       * └───┘
       * So combined, should be
       * UNION        INTERSECTION     DIFFERENCE
       *   ┌─┐
       * ┌─┘ │             ┌─┐            ┌─┐
       * │   │             └─┘            │ └─┐
       * └───┘                            └───┘
       */
      const combinations = combineShapes(square, shiftedRectangle);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 2, y: 3},
          {x: 2, y: 0},
          {x: 0, y: 0},
          {x: 0, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 3},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, [[
          {x: 1, y: 1},
          {x: 1, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 1},
        ]]);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 0},
          {x: 0, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 1},
          {x: 2, y: 1},
          {x: 2, y: 0},
        ]]);
      });
    });

    describe('covered-edge overlapped shapes', () => {
      /* Shapes will look like
       * ┌───┐
       * ├─┐ │
       * └─┴─┘
       * So combined, should be
       * UNION        INTERSECTION     DIFFERENCE
       * ┌───┐                           ┌───┐
       * │   │          ┌─┐              └─┐ │
       * └───┘          └─┘                └─┘
       */
      const combinations = combineShapes(square, smallSquare);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 2, y: 2},
          {x: 2, y: 0},
          {x: 0, y: 0},
          {x: 0, y: 2},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, [[
          {x: 0, y: 0},
          {x: 0, y: 1},
          {x: 1, y: 1},
          {x: 1, y: 0},
        ]]);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 0},
          {x: 1, y: 0},
          {x: 1, y: 1},
          {x: 0, y: 1},
        ]]);
      });
    });

    describe('covered-edge overlapped shapes (pt 2)', () => {
      /* Shapes will look like
       * ┌─┬─┐
       * │ └─┤
       * └───┘
       * So combined, should be
       * UNION        INTERSECTION     DIFFERENCE
       * ┌───┐            ┌─┐            ┌─┐
       * │   │            └─┘            │ └─┐
       * └───┘                           └───┘
       */
      const combinations = combineShapes(square, smallShiftedSquare);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 2, y: 2},
          {x: 2, y: 0},
          {x: 0, y: 0},
          {x: 0, y: 2},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, [[
          {x: 1, y: 1},
          {x: 1, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 1},
        ]]);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 0},
          {x: 0, y: 2},
          {x: 1, y: 2},
          {x: 1, y: 1},
          {x: 2, y: 1},
          {x: 2, y: 0},
        ]]);
      });
    });

    describe('partial edge overlap', () => {
      /* Shapes will look like
       * ┌─┐
       * │ ├─┐
       * └─┴─┘
       * So combined, should be
       * UNION        INTERSECTION     DIFFERENCE
       * ┌─┐                             ┌─┐
       * │ └─┐                           │ │
       * └───┘                           └─┘
       */
      const combinations = combineShapes(rectangle, smallShiftedSquare);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 0, y: 1},
          {x: 0, y: 3},
          {x: 1, y: 3},
          {x: 1, y: 2},
          {x: 2, y: 2},
          {x: 2, y: 1},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, []);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 1},
          {x: 0, y: 3},
          {x: 1, y: 3},
          {x: 1, y: 1},
        ]]);
      });
    });

    describe('weird edge case 1', () => {
      /* This is for weird edge cases, as the description says. Hard to box-draw
       * these test cases.
       *
       * This one is intended to test the handleOverlap function's firstLine
       * split.
       */
      const triangleA = [
        {x: 0, y: 0},
        {x: 2, y: 0},
        {x: 2, y: 2},
      ];
      const triangleB = [
        {x: 1, y: 1},
        {x: 1, y: 3},
        {x: 3, y: 3},
      ];
      const combinations = combineShapes(triangleA, triangleB);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 0, y: 0},
          {x: 1, y: 1},
          {x: 1, y: 3},
          {x: 3, y: 3},
          {x: 2, y: 2},
          {x: 2, y: 0},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, []);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 0, y: 0},
          {x: 2, y: 2},
          {x: 2, y: 0},
        ]]);
      });
    });

    describe('weird edge case 2', () => {
      /* This is for weird edge cases, as the description says. Hard to box-draw
       * these test cases.
       *
       * This one is intended to test the handleOverlap function's firstLine
       * split.
       */
      const triangleB = [
        {x: 0, y: 0},
        {x: 2, y: 2},
        {x: 2, y: 0},
      ];
      const triangleA = [
        {x: 1, y: 1},
        {x: 3, y: 3},
        {x: 1, y: 3},
      ];
      const combinations = combineShapes(triangleA, triangleB);
      it('should find union', () => {
        shapesMatch(combinations.union, [[
          {x: 0, y: 0},
          {x: 1, y: 1},
          {x: 1, y: 3},
          {x: 3, y: 3},
          {x: 2, y: 2},
          {x: 2, y: 0},
        ]]);
      });
      it('should find intersection', () => {
        shapesMatch(combinations.intersection, []);
      });
      it('should find difference', () => {
        shapesMatch(combinations.difference, [[
          {x: 1, y: 1},
          {x: 1, y: 3},
          {x: 3, y: 3},
        ]]);
      });
    });
  });

  describe('Utility functions', () => {
    it('should have union()', () => {
      shapesMatch(union(square, shiftedSquare), [[
        {x: 3, y: 3},
        {x: 3, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 2},
        {x: 1, y: 2},
        {x: 1, y: 3},
      ]]);
    });

    it('should have intersection()', () => {
      shapesMatch(intersection(square, shiftedSquare), [[
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 2, y: 1},
      ]]);
    });

    it('should have difference()', () => {
      shapesMatch(difference(square, shiftedSquare), [[
        {x: 0, y: 0},
        {x: 0, y: 2},
        {x: 1, y: 2},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 0},
      ]]);
    });
  });
});
