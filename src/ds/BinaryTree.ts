type TGen<T> = Generator<T, undefined, undefined>;

function getOrder<T>(
  tree: BinaryTree<T>,
  reversed: boolean
): [BinaryTree<T> | undefined, BinaryTree<T> | undefined] {
  return reversed ? [tree.right, tree.left] : [tree.left, tree.right];
}

function* inorder<T>(
  tree: BinaryTree<T>,
  reversed: boolean = false
): TGen<T> {
  if (!tree.value) return undefined;
  const [first, last] = getOrder(tree, reversed);
  if (first) yield* inorder(first, reversed);
  yield tree.value;
  if (last) yield* inorder(last, reversed);
}

function* preorder<T>(
  tree: BinaryTree<T>,
  reversed: boolean = false
): TGen<T> {
  if (!tree.value) return undefined;
  const [first, last] = getOrder(tree, reversed);
  yield tree.value;
  if (first) yield* preorder(first, reversed);
  if (last) yield* preorder(last, reversed);
}

function* postorder<T>(
  tree: BinaryTree<T>,
  reversed: boolean = false
): TGen<T> {
  if (!tree.value) return undefined;
  const [first, last] = getOrder(tree, reversed);
  if (first) yield* postorder(first, reversed);
  if (last) yield* postorder(last, reversed);
  yield tree.value;
}

export type HasParent<Tree> = Tree & {
  parent: Tree;
  leftmostDescendant: HasParent<Tree>;
  rightmostDescendant: HasParent<Tree>;
};

export type IsRoot<Tree> = Tree & { parent: undefined };

export class BinaryTree<T> implements Iterable<T> {
  parent?: BinaryTree<T>;
  left?: HasParent<BinaryTree<T>>;
  right?: HasParent<BinaryTree<T>>;

  constructor(public value?: T) {}

  get size(): number {
    let size = 1;
    if (this.left) size += this.left.size;
    if (this.right) size += this.right.size;
    return size;
  }

  withParent<P extends BinaryTree<T>>(parent: P): this & HasParent<P> {
    this.parent = parent;
    return this as this & HasParent<P>;
  }

  withoutParent(): IsRoot<this> {
    this.parent = undefined;
    return this as IsRoot<this>;
  }

  setLeft(subtree: BinaryTree<T>): void {
    this.left = subtree.withParent(this);
  }

  setRight(subtree: BinaryTree<T>): void {
    this.right = subtree.withParent(this);
  }

  get leftmostDescendant(): BinaryTree<T> {
    return this.left ? this.left.leftmostDescendant : this;
  }

  get rightmostDescendant(): BinaryTree<T> {
    return this.right ? this.right.rightmostDescendant : this;
  }

  // Traversals
  [Symbol.iterator](): TGen<T> {
    return inorder(this);
  }

  readonly inorder: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => inorder(this)
  };

  readonly inorderReversed: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => inorder(this, true)
  };

  readonly preorder: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => preorder(this)
  };

  readonly preorderReversed: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => preorder(this, true)
  };

  readonly postorder: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => postorder(this)
  };

  readonly postorderReversed: Iterable<T> = {
    [Symbol.iterator]: (): TGen<T> => postorder(this, true)
  };
}
