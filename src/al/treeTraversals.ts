import { BinaryTree } from '../ds/BinaryTree';

type TGen<T> = Generator<T, undefined, undefined>

function getOrder<T>(
  tree: BinaryTree<T>,
  reversed: boolean,
): [BinaryTree<T> | undefined, BinaryTree<T> | undefined] {
  return reversed ? [tree.right, tree.left] : [tree.left, tree.right]
}

export function* inorder<T>(tree: BinaryTree<T>, reversed = false): TGen<T> {
  if (!tree.value) return undefined
  const [first, last] = getOrder(tree, reversed)
  if (first) yield* inorder(first, reversed)
  yield tree.value
  if (last) yield* inorder(last, reversed)
}

export function* preorder<T>(tree: BinaryTree<T>, reversed = false): TGen<T> {
  if (!tree.value) return undefined
  const [first, last] = getOrder(tree, reversed)
  yield tree.value
  if (first) yield* preorder(first, reversed)
  if (last) yield* preorder(last, reversed)
}

export function* postorder<T>(
  tree: BinaryTree<T>,
  reversed = false,
): TGen<T> {
  if (!tree.value) return undefined
  const [first, last] = getOrder(tree, reversed)
  if (first) yield* postorder(first, reversed)
  if (last) yield* postorder(last, reversed)
  yield tree.value
}
