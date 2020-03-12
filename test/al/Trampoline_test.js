import chai from "chai";
const should = chai.should();

import { trampoline, done, cont } from "../../src/al/Trampoline";

describe("AL - Trampoline", () => {
  function badsum(n) {
    if (n === 0) return 0;
    return n + badsum(n - 1);
  }
  function sum(n, p = 0) {
    if (n === 0) return done(p);
    return cont(() => sum(n - 1, n + p));
  }
  const safeFactorial = trampoline(sum);

  function bettersum(n) {
    return n + ((n - 1) * n) / 2;
  }

  it("should trampoline tail-recursive functions for small values", () => {
    safeFactorial(10).should.equal(bettersum(10));
  });

  it("should trampoline tail-recursive functions for large values", () => {
    let i = 1000;
    // find a value at which badsum causes a stack overflow,
    // then check the trampolined version
    while (true) {
      try {
        badsum(i);
        i *= 10;
      } catch (e) {
        safeFactorial(i).should.equal(bettersum(i));
        break;
      }
    }
  });
});
