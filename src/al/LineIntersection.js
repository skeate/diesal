const EPSILON = 0.01;

/**
 * Finds the magnitude of the cross product of two vectors (if we pretend
 * they're in three dimensions)
 *
 * @param {Object} a First vector (with `x` and `y` properties)
 * @param {Object} b Second vector (with `x` and `y` properties)
 * @private
 * @returns {Number} The magnitude of the cross product
 */
const krossProduct = (a, b) => a.x * b.y - a.y * b.x;

/**
 * Finds the dot product of two vectors.
 *
 * @param {Object} a First vector (with `x` and `y` properties)
 * @param {Object} b Second vector (with `x` and `y` properties)
 * @private
 * @returns {Number} The dot product
 */
const dotProduct = (a, b) => a.x * b.x + a.y * b.y;

/**
 * Finds the intersection (if any) between two line segments a and b, given the
 * line segments' end points a1, a2 and b1, b2.
 *
 * This algorithm is based on Schneider and Eberly.
 * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
 * Page 244.
 *
 * @param {Object} a1 {x, y} point of first line
 * @param {Object} a2 {x, y} point of first line
 * @param {Object} b1 {x, y} point of second line
 * @param {Object} b2 {x, y} point of second line
 * @returns {Object|Array|null} If the lines intersect, the point of
 * intersection. If they overlap, the two end points of the overlapping segment.
 * Otherwise, null.
 */
const getIntersection = (a1, a2, b1, b2) => {
  // The algorithm expects our lines in the form P + sd, where P is a point,
  // s is on the interval [0, 1], and d is a vector.
  // We are passed two points. P can be the first point of each pair. The
  // vector, then, could be thought of as the distance (in x and y components)
  // from the first point to the second point.
  // So first, let's make our vectors:
  const va = {x: a2.x - a1.x, y: a2.y - a1.y};
  const vb = {x: b2.x - b1.x, y: b2.y - b1.y};
  // We also define a function to convert back to regular point form:

  /* eslint-disable arrow-body-style */

  const toPoint = (p, s, d) => {
    return {
      x: p.x + s * d.x,
      y: p.y + s * d.y,
    };
  };

  /* eslint-enable arrow-body-style */

  // The rest is pretty much a straight port of the algorithm.
  const e = {
    x: b1.x - a1.x,
    y: b1.y - a1.y,
  };
  let kross = krossProduct(va, vb);
  let sqrKross = kross * kross;
  const sqrLenA = dotProduct(va, va);
  const sqrLenB = dotProduct(vb, vb);
  // Check for line intersection. This works because of the properties of the
  // cross product -- specifically, two vectors are parallel if and only if the
  // cross product is the 0 vector. The full calculation involves relative error
  // to account for possible very small line segments. See Schneider & Eberly
  // for details.
  if (sqrKross > EPSILON * sqrLenA * sqrLenB) {
    // If they're not parallel, then (because these are line segments) they
    // still might not actually intersect. This code checks that the
    // intersection point of the lines is actually on both line segments.
    const s = krossProduct(e, vb) / kross;
    if (s < 0 || s > 1) {
      // not on line segment a
      return null;
    }
    const t = krossProduct(e, va) / kross;
    if (t < 0 || t > 1) {
      // not on line segment b
      return null;
    }
    return toPoint(a1, s, va);
  }
  // If we've reached this point, then the lines are either parallel or the
  // same, but the segments could overlap partially or fully, or not at all.
  // So we need to find the overlap, if any. To do that, we can use e, which is
  // the (vector) difference between the two initial points. If this is parallel
  // with the line itself, then the two lines are the same line, and there will
  // be overlap.
  const sqrLenE = dotProduct(e, e);
  kross = krossProduct(e, va);
  sqrKross = kross * kross;
  if (sqrKross > EPSILON * sqrLenA * sqrLenE) {
    // Lines are just parallel, not the same. No overlap.
    return null;
  }
  const sa = dotProduct(va, e) / sqrLenA;
  const sb = sa + dotProduct(va, vb) / sqrLenA;
  const smin = Math.min(sa, sb);
  const smax = Math.max(sa, sb);
  // this is, essentially, the FindIntersection acting on floats from
  // Schneider & Eberly, just inlined into this function.
  if (smin < 1 && smax > 0) {
    // There's overlap on a segment -- two points of intersection. Return both.
    return [
      toPoint(a1, smin > 0 ? smin : 0, va),
      toPoint(a1, smax < 1 ? smax : 1, va),
    ];
  }
  // overlap on an end point -- for our purposes, we don't care.
  return null;
};

export default getIntersection;
