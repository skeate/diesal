import lineIntersection from './LineIntersection';
import BinarySearchTree from '../ds/BinarySearchTree';
import Heap from '../ds/Heap';

/**
 * A point
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Checks if this point is less than some other point, where less than is
   * defined as lesser in x or, if equal x, lesser in y coordinate.
   * @param {Point} p The other point to compare to
   * @returns {boolean} True if this point is less than the passed point
   */
  lt(p) {
    return this.x < p.x || this.x === p.x && this.y < p.y;
  }

  /**
   * Checks if this point equals another point.
   * @param {Point} p The other point to compare to
   * @returns {boolean} True if the points are equal
   */
  eq(p) {
    return this.x === p.x && this.y === p.y;
  }

  /* useful for debugging
  toString() {
    return `(${this.x}, ${this.y})`;
  }
  */
}


/**
 * Metadata class for a "sweep event" (really, a point), which includes
 * whether this is the left point, a reference to the other point's SweepEvent,
 * whether it's part of the "clipping" polygon, etc.
 *
 * @private
 * @property {Point} p The point
 * @property {Boolean} left Whether this is the "left" point in the pairing
 */
class SweepEvent {
  /**
   * @param {Point} p A point
   */
  constructor(p) {
    this.p = p;
    this.type = 'R';
  }

  get left() {
    return Boolean(this.other) && this.p.lt(this.other.p);
  }

  get slope() {
    return (this.left ? 1 : -1)
      * (this.other.p.y - this.p.y) / (this.other.p.x - this.p.x);
  }

  get inOut() {
    return this._inOut;
  }

  set inOut(value) {
    /* istanbul ignore else */
    if (this.other) {
      this.other._inOut = value;
    }
    this._inOut = value;
  }

  get inside() {
    return this._inside;
  }

  set inside(value) {
    /* istanbul ignore else */
    if (this.other) {
      this.other._inside = value;
    }
    this._inside = value;
  }

  /**
   * Pair this `SweepEvent` with another (ensure their `other` point to each
   * other and they are part of the same polygon).
   *
   * @param {SweepEvent} other The SweepEvent to pair with
   */
  pair(other) {
    this.other = other;
    other.other = this;
    other.inside = this.inside;
    other.inOut = this.inOut;
    other.type = this.type;
    other.isClipping = this.isClipping;
  }

  /**
   * Set a type representing the kind of SweepEvent:
   * - 'N': Noncontributing; not included in output.
   * - 'S': Same transition; needed in union and intersection, not in difference
   * - 'D': Different transition; needed in difference, not in others
   * - 'R': Required (the default type)
   *
   * @param {String} type The type to set
   */
  setType(type) {
    this.type = type;
    this.other.type = type;
  }

  /* useful for debugging
  toString() {
    return `{ ${this.isClipping ? 'A' : 'B'}${this.inOut ? 'T' : 'Q'}${
    this.inside ? 'I' : 'O'}${this.type} ${this.p} -> ${this.other
    ? this.other.p : null} ${this.isClipping ? 'A' : 'B'}${this.other.inOut
    ? 'T' : 'Q'}${this.other.inside ? 'I' : 'O'}${this.other.type} }`;
  }
  */
}

/**
 * Represents a chain of SweepEvents. Useful to efficiently combine all the
 * outer edges of the polygons.
 *
 * @private
 * @property {Boolean} closed Whether or not the chain is closed
 * @property {Point} start The start of the chain
 * @property {Point} end The end of the chain
 * @property {Point[]} points All the points in the chain
 */
class Chain {
  /**
   * @param {SweepEvent} sweepEvent An initial sweep event to include in chain
   */
  constructor(sweepEvent) {
    this.points = [];
    this.closed = false;
    this.points.push(sweepEvent.p);
    this.points.push(sweepEvent.other.p);
  }

  get start() {
    return this.points[0];
  }

  get end() {
    return this.points[this.points.length - 1];
  }

  /**
   * Adds a new edge to the chain, if it can.
   *
   * @param {SweepEvent} sweepEvent The `SweepEvent` to try to add
   * @returns {boolean} Whether the add was successful or not
   */
  add(sweepEvent) {
    /* istanbul ignore if */
    if (this.closed) {
      return false;
    }
    const pEqualsStart = sweepEvent.p.eq(this.start);
    const pEqualsEnd = sweepEvent.p.eq(this.end);
    const opEqualsStart = sweepEvent.other.p.eq(this.start);
    const opEqualsEnd = sweepEvent.other.p.eq(this.end);
    if (pEqualsStart && opEqualsEnd || opEqualsStart && pEqualsEnd) {
      // the new edge's points match the current chains' endpoints
      // i.e., it closes the chain
      this.closed = true;
    }
    else if (pEqualsStart) {
      this.points.unshift(sweepEvent.other.p);
    }
    else if (pEqualsEnd) {
      this.points.push(sweepEvent.other.p);
    }
    else if (opEqualsStart) {
      this.points.unshift(sweepEvent.p);
    }

    /* istanbul ignore else */
    else if (opEqualsEnd) {
      this.points.push(sweepEvent.p);
    }
    else {
      return false;
    }
    return true;
  }

  /**
   * Attach another chain onto this one
   *
   * The connecting edge has already been attached to both chains, so they look
   * something like
   *
   * 0,0 -> 0,1 -> 1,1 -> 1,0 | 1,1 -> 1,0 -> 0,0
   *
   * In this case the connecting edge was 1,1 -> 1,0.
   *
   * @param {SweepEvent} edge The connecting edge
   * @param {Chain} chain The chain to add
   * @returns {Boolean} Whether the merge happened or not
   */
  merge(edge, chain) {
    /* istanbul ignore if */
    if (this.closed) {
      return false;
    }
    const prepending = edge.p === this.start || edge.other.p === this.start;
    const toChainEnd = edge.p === chain.end
      /* istanbul ignore next */
      || edge.other.p === chain.end;
    // This code needs a test case, but finding one is a bit hard.
    /* istanbul ignore if */
    if (prepending) {
      this.points = toChainEnd
        ? chain.points.concat(this.points.slice(2))
        : chain.points.reverse().concat(this.points.slice(2));
    }
    else {
      this.points = toChainEnd
        ? this.points.concat(chain.points.reverse().slice(2))
        /* istanbul ignore next */
        : this.points.concat(chain.points.slice(2));
    }
    // Not sure if this is actually needed
    /* istanbul ignore if */
    if (this.start.eq(this.end)) {
      // We've closed the chain! But we've also doubled the endpoint, so we need
      // to remove it.
      this.closed = true;
      this.points.pop();
    }
    return true;
  }
}

/**
 * Stores a collection of chains. Simplifies adding edges and merging chains.
 *
 * @private
 */
class ChainCollection {
  constructor() {
    this.chains = [];
  }

  get simplified() {
    const simplify = (points) => {
      const slope = (a, b) => (b.y - a.y) / (b.x - a.x);
      const simple = [];
      let i, len;
      for (i = 0, len = points.length; i < len;) {
        const a = points[i];
        simple.push(a);
        let b, c, slopeAB, slopeAC;
        do {
          b = points[(i + 1) % len];
          c = points[(i + 2) % len];
          slopeAB = slope(a, b);
          slopeAC = slope(a, c);
          i++;
        } while (slopeAB === slopeAC || a.eq(b));
      }
      if (i > len) {
        // first point is collinear with last and second
        simple.shift();
      }
      return simple;
    };
    return this.chains.map((chain) => simplify(chain.points));
  }

  /**
   * Add a new edge to the chain collection. This could create a new chain,
   * augment an existing one, or even merge two chains into one.
   *
   * @param {SweepEvent} edge The edge to be added
   */
  addEdge(edge) {
    const chainsAddedTo = [];
    this.chains.forEach((chain) => {
      /* istanbul ignore else */
      if (chain.add(edge)) {
        chainsAddedTo.push(chain);
      }
    });
    switch (chainsAddedTo.length) {
      case 0:
        // no chain could add the new edge, so we make a new chain.
        this.chains.push(new Chain(edge));
        break;
      case 1:
        // added to a chain; good to know, otherwise don't care.
        break;
      case 2:
        // added to two chains, meaning those two chains should be merged
        // if we're trying to add edges that aren't chainable, this could fail.
        // no idea how to test this, though.
        /* istanbul ignore if */
        if (!chainsAddedTo[0].merge(edge, chainsAddedTo[1])) {
          throw new Error('Failed trying to link disjoint paths');
        }
        this.chains.splice(this.chains.indexOf(chainsAddedTo[1]), 1);
        break;

      /* istanbul ignore next */
      default:
        // added to three chains, only happens if something's wrong
        throw new Error('Vertex links more than two edges');
    }
  }
}

/**
 * Sets flags on a SweepEvent to help determine whether it is inside or outside
 * of the combined polygon.
 *
 * @private
 * @param {SweepEvent} eventA The `SweepEvent` on which to set flags. NOTE: Will
 * be modified!
 * @param {SweepEvent} eventB A `SweepEvent` which is used as a reference to
 * determine inside/outsideness of `eventA`
 */
const _setInsideFlag = (eventA, eventB) => {
  if (eventB === null) {
    eventA.inside = eventA.inOut = false;
  }
  else if (eventA.isClipping === eventB.isClipping) {
    // same polygon
    eventA.inside = eventB.inside;
    eventA.inOut = !eventB.inOut;
  }
  else {
    eventA.inside = !eventB.inOut;
    eventA.inOut = eventB.inside;
  }
};

/**
 * Sorts SweepEvents by X coordinate ascending, then by Y coordinate ascending.
 *
 * @private
 * @param {SweepEvent[]} points A list of SweepEvents
 * @return {SweepEvent[]} Sorted list of SweepEvents
 */
const sort = (points) => points.slice().sort((a, b) => {
  if (a.p.lt(b.p)) {
    return -1;
  }
  if (a.p.eq(b.p)) {
    if (a.other.p.lt(b.other.p)) {
      return -1;
    }
    if (a.other.p.eq(b.other.p)) {
      return 0;
    }
    return 1;
  }
  return 1;
});

/**
 * Breaks a shape down into edges, in the form of SweepEvents.
 *
 * @private
 * @param {Point[]} shape The shape to decompose
 * @param {Boolean} isClipping Whether this shape is the "clipping" polygon
 * @returns {SweepEvent[]} a list of SweepEvents
 */
const decomposeShape = (shape, isClipping) => {
  const sweepEvents = [];
  // abuse reduce a bit to get points pairwise, wrapping around
  shape.reduce((a, b) => {
    const eventA = new SweepEvent(a);
    const eventB = new SweepEvent(b);
    eventA.isClipping = isClipping;
    eventB.isClipping = isClipping;
    eventA.other = eventB;
    eventB.other = eventA;
    if (eventA.left) {
      sweepEvents.push(eventA);
      sweepEvents.push(eventB);
    }
    else {
      sweepEvents.push(eventB);
      sweepEvents.push(eventA);
    }
    return b;
  }, shape[shape.length - 1]);
  return sweepEvents;
};

/**
 * Split a line at an intersection point and return the newly-created
 * `SweepEvent`s.
 *
 * This does not check whether the point is on the line; hence, if you try to
 * split a line on a point not on the line, you'll get weird results.
 *
 * @param {SweepEvent} line Line to split
 * @param {Point} intersection Point to split line at
 * @returns {SweepEvent[]} New `SweepEvent`s that connect to the two endpoints.
 */
const splitLine = (line, intersection) => {
  if (line.p.eq(intersection) || line.other.p.eq(intersection)) {
    return [];
  }
  const newSweepEvents = [
    new SweepEvent(intersection),
    new SweepEvent(intersection),
  ];
  line.other.pair(newSweepEvents[1]);
  line.pair(newSweepEvents[0]);
  return newSweepEvents;
};

/**
 * Handle the overlap of two lines. If necessary, push any new points onto `q`.
 *
 * @param {Point[]} intersection The two endpoints of the overlapping region
 * @param {SweepEvent} eventA The next SweepEvent in the priority queue
 * @param {SweepEvent} eventB Another SweepEvent that could possibly intersect
 *                            `eventA`.
 * @param {Heap<SweepEvent>} q The queue into which to insert any new
 *                             SweepEvents created by intersections.
 */
const _handleOverlap = (intersection, eventA, eventB, q) => {
  // The lines are the same and overlap at some point, so handle this special
  // First, we want to sort these points so that deciding which should connect
  // to what is easier.
  const sorted = sort([
    eventA,
    eventA.other,
    eventB,
    eventB.other,
  ]);
  // sorted[0] and sorted[1] are necessarily points from different edges.
  // If they were the same edge, then there would be no overlap, other than
  // perhaps a point -- which we are already ignoring.
  const firstLine = splitLine(sorted[0], intersection[0]);
  firstLine.forEach((s) => {
    if (!s.p.eq(s.other.p)) {
      q.push(s);
    }
  });
  if (firstLine.length) {
    firstLine[1].setType('N');
  }
  else {
    sorted[0].setType('N');
  }
  const secondLine = splitLine(sorted[1], intersection[1]);
  secondLine.forEach((s) => {
    if (!s.p.eq(s.other.p)) {
      q.push(s);
    }
  });
  if (sorted[1].type === 'R') {
    sorted[1].setType(sorted[0].inOut === sorted[1].inOut ? 'S' : 'D');
  }
};

/**
 * Handle case where lines overlap at a single point, either through (like an X)
 * or on end (like a T).
 *
 * @param {Point} intersection The endpoints of the overlapping segment
 * @param {SweepEvent} eventA The next SweepEvent in the priority queue
 * @param {SweepEvent} eventB Another SweepEvent that could possibly intersect
 *                            `eventA`.
 * @param {Heap<SweepEvent>} q The queue into which to insert any new
 *                             SweepEvents created by intersections.
 */
const _handleIntersection = (intersection, eventA, eventB, q) => {
  const endsOnPoint = (l, p) => l.p.eq(p) || l.other.p.eq(p);
  const aEndsOnIntersection = endsOnPoint(eventA, intersection);
  const bEndsOnIntersection = endsOnPoint(eventB, intersection);
  // If the intersection is a shared point (e.g. V) then we don't care;
  // both lines are already part of our set.
  if (aEndsOnIntersection && bEndsOnIntersection) {
    return;
  }
  // If the intersection is the end of one edge (e.g. T) then we split the other
  // edge. If the intersection is in the middle of both edges, then we split
  // them both up.
  if (!aEndsOnIntersection) {
    splitLine(eventA, intersection).forEach((s) => q.push(s));
  }
  if (!bEndsOnIntersection) {
    splitLine(eventB, intersection).forEach((s) => q.push(s));
  }
};

/**
 * Handles the intersection (if any) of two lines defined by two `SweepEvent`s
 * eventA and eventB. If there is an intersection, it will split the lines at
 * the intersection point, and then push the new `SweepEvent`s into the priority
 * queue `q`.
 *
 * Some assumptions are made:
 *
 * 1. `eventA` is an event that was just popped out of the queue.
 * 2. `eventA` is left of `eventA.other`. We're assuming this is in a sweep line
 *    algorithm, so we should've already dealt with the left point of the line.
 *
 * @private
 * @param {SweepEvent} eventA The next SweepEvent in the priority queue
 * @param {SweepEvent} eventB Another SweepEvent that could possibly intersect
 *                            `eventA`.
 * @param {Heap<SweepEvent>} q The queue into which to insert any new
 *                             SweepEvents created by intersections.
 * @param {String} [geometry] The type of geometry these lines are on (either
 * `"euclidean"` or `"spherical"`).
 */
const _possibleIntersection = (eventA, eventB, q, geometry = 'euclidean') => {
  const intersection = geometry === 'euclidean'
    ? lineIntersection(eventA.p, eventA.other.p, eventB.p, eventB.other.p)
    : null;
    // : arcIntersection(eventA.p, event.other.p, eventB.p, eventB.other.p);
  if (!intersection) {
    return;
  }
  if (intersection instanceof Array) {
    const intPoints = intersection.map((i) => new Point(i.x, i.y));
    _handleOverlap(intPoints, eventA, eventB, q);
  }
  else {
    const intPoint = new Point(intersection.x, intersection.y);
    _handleIntersection(intPoint, eventA, eventB, q);
  }
};

const pushToSets = (event, union, intersection, difference) => {
  switch (event.type) {
    case 'R':
      if (event.isClipping !== event.inside) {
        difference.push(event.other);
      }
      if (event.inside) {
        intersection.push(event.other);
      }
      else {
        union.push(event.other);
      }
      break;
    case 'S':
      intersection.push(event.other);
      union.push(event.other);
      break;
    case 'D':
      difference.push(event.other);
      break;
    default:
      // non-contributing; noop
      break;
  }
};

/**
 * Combine two shapes, generating both the union and intersection.
 *
 * This is an implementation of an algorithm developed by
 * Martinez, Rueda, and Feito
 * http:// www.cs.ucr.edu/~vbz/cs230papers/martinez_boolean.pdf
 *
 * @param {Object[]} shapeA A shape representated as an array of points `{x, y}`
 * @param {Object[]} shapeB A shape representated as an array of points `{x, y}`
 * @returns {Object} An object containing the `union` and `intersection`, both
 * of which are arrays of arrays of points (because the intersection, in
 * particular, could be a disjoint set of polygons).
 */
export const combineShapes = (shapeA, shapeB) => {
  const pointsA = shapeA.map((p) => new Point(p.x, p.y));
  const pointsB = shapeB.map((p) => new Point(p.x, p.y));
  const edges = decomposeShape(pointsA, true)
    .concat(decomposeShape(pointsB, false));
  const s = new BinarySearchTree([], (a, b) => a.p.y < b.p.y);
  const sortingFunc = (a, b) => a.p.x < b.p.x
    || a.p.x === b.p.x && (
      a.p.y < b.p.y
      || a.p.y === b.p.y && (
        !a.left && b.left
        || a.left === b.left && (
          a.slope < b.slope
          || a.other.p.y < b.other.p.y
          || a.other.p.y === b.other.p.y && a.other.p.x > b.other.p.x
        )
      )
    );
  const q = new Heap(edges, sortingFunc);
  const unionEdges = [];
  const intersectionEdges = [];
  const differenceEdges = [];
  let x;
  while (q.length) {
    const event = q.pop();
    if (x !== event.p.x) {
      x = event.p.x;
    }
    if (event.left) {
      if (event.type !== 'N') {
        s.insert(event);
      }
      const before = s.getPredecessor(event);
      const after = s.getSuccessor(event);
      _setInsideFlag(event, before);
      if (before) {
        _possibleIntersection(event, before, q);
      }
      if (after) {
        _possibleIntersection(event, after, q);
      }
    }
    else {
      const before = s.getPredecessor(event.other);
      const after = s.getSuccessor(event.other);
      pushToSets(
        event,
        unionEdges,
        intersectionEdges,
        differenceEdges
      );
      s.remove(event.other);
      if (before && after) {
        _possibleIntersection(before, after, q);
      }
    }
  }
  const union = new ChainCollection();
  const intersection = new ChainCollection();
  const difference = new ChainCollection();
  unionEdges.forEach((edge) => union.addEdge(edge));
  intersectionEdges.forEach((edge) => intersection.addEdge(edge));
  differenceEdges.forEach((edge) => difference.addEdge(edge));
  return {
    union: union.simplified,
    intersection: intersection.simplified,
    difference: difference.simplified,
  };
};

/**
 * Finds the union of two given shapes. NOTE: This is a convenience function.
 * If you need multiple operations, use `combineShapes`.
 *
 * @param {Object[]} shapeA A shape representated as an array of points `{x, y}`
 * @param {Object[]} shapeB A shape representated as an array of points `{x, y}`
 * @returns {Array[]} An array of arrays, with each element being a point.
 */
export const union = (shapeA, shapeB) => combineShapes(shapeA, shapeB).union;

/**
 * Finds the intersection of two given shapes. NOTE: This is a convenience
 * function. If you need multiple operations, use `combineShapes`.
 *
 * @param {Object[]} shapeA A shape representated as an array of points `{x, y}`
 * @param {Object[]} shapeB A shape representated as an array of points `{x, y}`
 * @returns {Array[]} An array of arrays, with each element being a point.
 */
export const intersection = (shapeA, shapeB) =>
  combineShapes(shapeA, shapeB).intersection;

/**
 * Finds the difference of two given shapes. NOTE: This is a convenience
 * function. If you need multiple operations, use `combineShapes`.
 *
 * @param {Object[]} shapeA A shape representated as an array of points `{x, y}`
 * @param {Object[]} shapeB A shape representated as an array of points `{x, y}`
 * @returns {Array[]} An array of arrays, with each element being a point.
 */
export const difference = (shapeA, shapeB) =>
  combineShapes(shapeA, shapeB).difference;
