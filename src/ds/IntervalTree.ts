import { Comparator } from './BinarySearchTree'
import { RBTree } from './RBTree'

type Interval<T> = {
  low: number
  high: number
  max: number
  value: T
}

function recalculateMax<T>(node: RBTree<Interval<T>>): number {
  let max = node.value.high
  if (node.left) max = Math.max(max, node.left.value.max)
  if (node.right) max = Math.max(max, node.right.value.max)
  node.value.max = max
  return max
}

/**
 * An interval tree is a data structure that holds intervals. For example, if
 * you had events which took place over a period of time, you might store them
 * in an interval tree where the interval is their duration.
 *
 * It allows you to find all intervals which contain a specific point, or
 * overlap with a given interval.
 */
export class IntervalTree<T> {
  private _size: number
  private tree?: RBTree<Interval<T>>
  /**
   * Constructs an empty interval tree.
   */
  constructor(protected eq: Comparator<T> = (a, b): boolean => a === b) {
    this._size = 0
    this.tree = undefined
  }

  get size(): number {
    return this._size
  }

  insert(low: number, high: number, value: T): this {
    const interval = {
      low,
      high,
      value,
      max: high,
    }
    if (!this.tree) {
      this.tree = new RBTree(
        interval,
        (a, b) => a.low < b.low,
        (a, b) =>
          a.low === b.low && a.high === b.high && this.eq(a.value, b.value),
      )
    } else {
      let node = this.tree.insertAndReturnNode(interval)
      if (node.left) recalculateMax(node.left)
      if (node.right) recalculateMax(node.right)
      recalculateMax(node)
      while (node.parent) {
        recalculateMax(node.parent)
        node = node.parent
      }
    }
    this._size++
    return this
  }

  remove(low: number, high: number, value: T): this {
    if (this.tree) {
      this.tree.remove({ low, high, value, max: high })
    }
    return this
  }

  lookup(position: number): T[] {
    if (!this.tree) return []

    const overlaps: T[] = []
    const stack = [this.tree]
    while (stack.length) {
      const node = stack.pop()
      if (!node) continue
      if (node.value.low <= position && node.value.high >= position) {
        overlaps.push(node.value.value)
      }
      if (node.left && node.left.value.max >= position) stack.push(node.left)
      if (
        node.right &&
        node.value.low <= position &&
        node.right.value.max >= position
      ) {
        stack.push(node.right)
      }
    }
    return overlaps
  }

  overlap(low: number, high: number): T[] {
    if (!this.tree) return []

    const overlaps: T[] = []
    const stack = [this.tree]
    while (stack.length) {
      const node = stack.pop()
      if (!node) continue
      if (low <= node.value.high && high >= node.value.low) {
        overlaps.push(node.value.value)
      }
      if (node.left && node.left.value.max >= low) stack.push(node.left)
      if (node.right && node.right.value.max >= low) stack.push(node.right)
    }
    return overlaps
  }
}
