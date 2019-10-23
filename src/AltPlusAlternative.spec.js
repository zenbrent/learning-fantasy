/***********************************
 * Alt
 * alt :: Alt f => f a ~> f a -> f a
 *   aka <|>
 *
 * Laws:
 * Associativity
 * a.alt(b).alt(c) = a.alt(b.alt(c))
 *   Keep LTR order the same
 *
 * Distributivity
 * a.alt(b).map(f) === a.map(f).alt(b.map(f))
 *
 * Intuition:
 * Like a semigroup, but for functors. Combine
 * functors w/o requiring that the contents are
 * semigroups. Gives you a fallback when the first
 * thing fails.
 * It's like a functor-level if/else
 *
 *
 ***********************************
 * Plus
 * zero :: Functor f, Plus f => () -> f a
 *
 * Laws:
 * Right identity
 * x.alt(A.zero()) == x
 *
 * Left identity
 * A.zero().alt() == x
 *
 * Annihilation
 * A.zero().map(f) == A.zero()
 *
 * Intuition:
 * Like a monoid but for functors. Zero adds an identity to Alts.
 *
 ***********************************
 * Alternative
 * no methods! just an Alt and a Plus
 *
 * Laws:
 * Distributivity
 * x.ap(f.alt(g))) === x.ap(f).alt(x.ap(g))
 *
 * Annihilation
 * x.ap(A.zero()) == A.zero()
 *
 * Intuition:
 * Monoid-shaped applicatives.
 * Zero is the identity at the context AND value level
 *
 *
 * http://www.tomharding.me/2017/04/24/fantas-eel-and-specification-10/
 */

import { tagged } from 'daggy';
import { Maybe, Just, Nothing } from './Maybe';
import { Left, Right } from './Either';
import { List } from './List';
import { Alt, Plus } from './Alt';
import { lift2 } from './lift';

import { patchArray } from './Array';
patchArray();

describe('Alt', () => {
  test('Maybe', () => {
    expect(
      Nothing.alt(Nothing).alt(Just(3))
    ).toEqual(Just(3))

    expect(
      Just(5).alt(Nothing).alt(Just(3))
    ).toEqual(Just(5))
  });
});

test('Plus', () => {
  expect(
    Maybe.empty().map(x => x + 1)
  ).toEqual(Nothing)

  expect(
    Array.empty().map(x => x + 1)
  ).toEqual([])
});

test('Either', () => {
  expect(
    Left('first').alt(Left('second'))
  ).toEqual(Left('second'));

  expect(
    Right('first').alt(Right('second'))
  ).toEqual(Left('first'));

  expect(
    Left('first').alt(Right('second'))
  ).toEqual(Left('second'));

  expect(
    Right('first').alt(Left('second'))
  ).toEqual(Left('first'));
});

describe('Alternative', () => {
  test('Maybe', () => {
    expect(
      Just(2).ap(Maybe.zero())
    ).toEqual(Nothing);
  });
});
