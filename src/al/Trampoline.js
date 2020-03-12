const isDone = Symbol();

/**
 * Trampolines are a technique for enabling efficient tail call recursion, so
 * you do not get stack overflows.
 *
 * Example usage:
 *
 *     function factorial(n, prev = 1) {
 *       if (n === 0) return done(prev)
 *       return cont((v) => factorial(n - 1, v));
 *     }
 *
 *     const safeFactorial = trampoline(factorial);
 *
 * @param {Function} f A thunked recursive function.
 * @returns {Function} A trampolined version of the recursive function.
 */
export const trampoline = (f) => (...args) => {
  let v = f(...args);
  while (!v[isDone]) {
    v = v();
  }
  return v();
};

/**
 * Annotates a thunk with information for `trampoline`.
 *
 * @param {Function} thunk A thunked continuation of the recursion.
 * @returns {Function} The thunk with some annotations for `trampoline`.
 */
export const cont = (thunk) => {
  thunk[isDone] = false;
  return thunk;
};

/**
 * Wraps a value to indicate to `trampoline` when the recursion is done.
 *
 * @param {*} value the final value of the recursion
 * @returns {Function} a thunked version of the final value, with annotations
 */
export const done = (value) => {
  const thunk = () => value;
  thunk[isDone] = true;
  return thunk;
};
