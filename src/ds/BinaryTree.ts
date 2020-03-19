export type HasParent<Tree> = Tree & {
  parent: Tree
  leftmostDescendant: HasParent<Tree>
  rightmostDescendant: HasParent<Tree>
}

export type HasLeft<Tree> = Tree & {
  left: Tree
}
export type HasRight<Tree> = Tree & {
  right: Tree
}

export type IsRoot<Tree> = Tree & { parent: undefined }

export class BinaryTree<T> {
  parent?: BinaryTree<T>
  left?: HasParent<BinaryTree<T>>
  right?: HasParent<BinaryTree<T>>

  constructor(public value: T) {}

  get size(): number {
    let size = 1
    if (this.left) size += this.left.size
    if (this.right) size += this.right.size
    return size
  }

  withParent<P extends BinaryTree<T>>(parent: P): this & HasParent<P> {
    this.parent = parent
    return this as this & HasParent<P>
  }

  withoutParent(): IsRoot<this> {
    this.parent = undefined
    return this as IsRoot<this>
  }

  setLeft(subtree: BinaryTree<T>): void {
    this.left = subtree.withParent(this)
  }

  setRight(subtree: BinaryTree<T>): void {
    this.right = subtree.withParent(this)
  }

  get isLeftChild(): boolean {
    return !!this.parent && this.parent.left === this
  }

  get isRightChild(): boolean {
    return !!this.parent && this.parent.right === this
  }

  get leftmostDescendant(): BinaryTree<T> {
    return this.left ? this.left.leftmostDescendant : this
  }

  get rightmostDescendant(): BinaryTree<T> {
    return this.right ? this.right.rightmostDescendant : this
  }

  prettyPrintValue(): string {
    return `${this.value}`
  }

  prettyPrint(indent = ''): string {
    let str = `${indent.substr(0, indent.length - 1)}${
      this.parent ? (this.isRightChild ? '├' : '└') : ''
    }─┬─ ${this.prettyPrintValue()}\n`
    if (this.right) {
      str += this.right.prettyPrint(indent + ' │')
    } else {
      str += `${indent} ├─── ×\n`
    }
    if (this.left) {
      str += this.left.prettyPrint(indent + '  ')
    } else {
      str += `${indent} └─── ×\n`
    }
    return str
  }

  toString(): string {
    return this.prettyPrint()
  }
}
