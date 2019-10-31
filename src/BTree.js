import { taggedSum } from 'daggy';
import { genericApImpl } from './genericAp';

import { lift3 } from './lift';

export const BTree = taggedSum('BTree', {
  Node: ['left', 'x', 'right'],
  Leaf: []
});

export const { Node, Leaf } = BTree;

BTree.empty = () => Leaf;

BTree.prototype.reduce = function (f) {
  return acc => this.cata({
    Leaf: () => acc,
    Node: (left, x, right) => {
      const l = left.reduce(f)(acc);
      const c = f(l)(x);
      return right.reduce(f)(c);
    }
  })
}

BTree.prototype.map = function (f) {
  return this.cata({
    Leaf: () => this,
    Node: (left, x, right) => Node(
      left.map(f),
      f(x),
      right.map(f)
    )
  });
}

BTree.prototype.equals = function (that) {
  return this.cata({
    Leaf: () => Leaf.is(that),
    Node: (left, x, right) =>
      x.equals(that.x) &&
      left.equals(that.left) &&
      right.equals(that.right)
  });
}

BTree.prototype.chain = function (f) {
  return this.cata({
    Leaf: () => Leaf,
    Node: (left, x, right) => f(x)
  });
}

// BTree.prototype.ap = genericApImpl;
BTree.prototype.ap = function (that) {
  return this.cata({
    Leaf: () => this,
    Node: (left, x, right) => that.cata({
      Leaf: () => that,
      Node: () => Node(
        left.ap(that.left),
        that.x(x),
        right.ap(that.right)
      )
    })
  });
}

BTree.prototype.traverse = function (T) {
  return f => this.cata({
    Node: (l, n, r) =>
      lift3 (l, n, r => Node(l, n, r))
        (l.traverse (T) (f))
        (f(n))
        (r.traverse (T) (f)),
    Leaf: () => T.of(Leaf)
  });
}

BTree.of = val => Node(Leaf, val, Leaf);
