/**
 * Applicative
 * Must be an Apply
 * of :: Applicative f => a -> f a
 *
 * Pointed Applicative has #of but not #ap. Not very useful.
 *
 * Laws:
 * Identity
 * v.ap(A.of(x => x)) == v
 *
 * Homomorphism
 * A.of(x).ap(A.of(f)) = A.of(f(x)))
 *   lift a fn & arg seperately & combine them
 *   OR combine them & lift the result.
 *
 * Interchange
 * A.of(y).ap(u) == u.ap(A.of(f => f(y)))
 *   ap applies the value in the right side to
 *   the value in the left.
 *
 * Intuition:
 * Most Apply types will also be Applicatives.
 * Apply merges contexts. To merge 0 or more values, use
 * concat + empty / Semigroup + Monoid.
 * To merge 0 or more contexts, use ap + of.
 *
 * http://www.tomharding.me/2017/04/17/fantas-eel-and-specification-9/
 */

import { tagged } from 'daggy';
import { lift2 } from './lift';
import { Maybe, Just, Nothing } from './Maybe';
import { List } from './List';

import { patchArray } from './Array';
patchArray();

// append = Monoid m
//       => a -> m a -> m a
const append = y => xs =>  xs.concat(
  xs.constructor.of(y)
);

// insideOut :: Applicative f, Monoid m
//           => m f a -> f m a
const insideOut = T => xs => xs.reduce(
  (acc, x) => lift2(append)(x)(acc),
  // this can make any Applicative into a Monoid, if
  // the inner type is a monoid:
  T.of(xs.constructor.empty())
);

// use this .concat to make any Applicative w/ a Monoid
// inner type into a Monoid
function defaultApplicative (that) {
  return lift2(x => y => x.concat(y))
    (this)
    (that);
}

describe('List', () => {
  const add = (x, y) => x + y;

  test('reduce values', () => {
    expect(
      List.from([1,2,3,4,5]).reduce(add, 0)
    ).toEqual(15);
  });

  test('reduce one value', () => {
    expect(
      List.from([1]).reduce(add, 0)
    ).toEqual(1);
  });

  test('reduce no values', () => {
    expect(
      List.from([]).reduce(add, 0)
    ).toEqual(0);
  });

  test('concat', () => {
    const list1 = List.from([1, 2, 3]);
    const list2 = List.from([9, 8, 8]);
    const empty = List.empty();

    expect(list1.concat(list2))
      .toEqual(List.from([1, 2, 3, 9, 8, 8]))

    expect(list1.concat(empty))
      .toEqual(List.from([1, 2, 3]))

    expect(empty.concat(list1))
      .toEqual(List.from([1, 2, 3]))
  });
});

describe('Applicative', () => {
  test('insideOut', () => {
    const maybeInsideOut = insideOut(Maybe);

    expect(
      maybeInsideOut([
        Just(1),
        Just(99),
        Just(2)
      ])
    ).toEqual(Just([1, 99, 2]));

    expect(
      maybeInsideOut(List.from([
        Just(1),
        Just(99),
        Just(2)
      ]))
    ).toEqual(Just(List.from([1, 99, 2])));

    expect(
      maybeInsideOut([
        Just(1),
        Nothing,
        Just(2)
      ])
    ).toEqual(Nothing);

    expect(
      maybeInsideOut(List.from([Just(1), Just(2)]))
    ).toEqual(Just(List.from([1, 2])));

    expect(
      maybeInsideOut(List.from([Just(1), Just(2)]))
    ).toEqual(Just(List.from([1, 2])));
  });
});

