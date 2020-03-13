export function assert(cond: any, msg?: string): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

