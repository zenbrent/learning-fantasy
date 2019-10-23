/***********************************
 * Foldable
 * reduce :: Foldable f =>
 *   f a ~> ((b, a) -> b, b) -> b
 *
 * Laws:
 * u.reduce(f) = toArray(u).reduce(f)
 *
 * Distributivity
 *
 * Intuition:
 *
 *
 * http://www.tomharding.me/2017/05/01/fantas-eel-and-specification-11/
 */

import { Maybe, Just, Nothing } from './Maybe';
import { BTree, Node, Leaf } from './BTree';
import { fold } from './fold';
import {
  // foldL, foldR,
  Sum, Product, Any, All, First, Last, Min, Max
} from './Semigroup';

describe('Foldable', () => {
  test('Maybe', () => {
    expect(
      Just(1).reduce(x => y => x + y) (2)
    ).toEqual(3);

    expect(
      Nothing.reduce(x => y => x + y) (2)
    ).toEqual(2);
  });

  describe('BTree', () => {
    const tree = Node(
      Node(Leaf, 1, Leaf),
      9,
      Node(
        Node(BTree.of(1.5), 12, Leaf),
        1,
        Node(Leaf, 12, BTree.of(1.5)),
      )
    )

    expect(
      tree.reduce (a => b => a + b) (0)
    ).toEqual(38);

    expect(
      fold (Sum) (tree)
    ).toEqual(Sum(38));
  });
});
