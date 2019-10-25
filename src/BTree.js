import { taggedSum } from 'daggy';

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

BTree.prototype.traverse = function (T) {
  return f => this.cata({
    Node: (l, n, r) => lift3
      (l, n, r => Node(l, n, r))
      (l.traverse (T) (f))
      (f(n))
      (r.traverse (T) (f)),
    Leaf: () => T.of(Leaf)
  })
}

BTree.of = val => Node(Leaf, val, Leaf);
