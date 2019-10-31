/**
 * Chain
 *
 * Laws:
 * Associativity
 * m.chain(f).chain(g) == m.chain(x => f(x).chain(g))
 *   Semigroups are associative at value-level
 *   Apply is associative at context-level
 *   Chain is associative at order-level
 *
 *
 * Intuition:
 * Functors create a context where the language can be extended.
 *  e.g. Array = multiple results, Maybe = possible failure,
 *       Either = possible exception, Task = async action
 * Applicative functors' context can be combined, e.g. lift & Traversable
 *
 * Chain lets you compose two functor returning functions
 *
 * Encodes order into programs -- you can strictly forbid (or allow)
 * parallelism. e.g. when you chain a Maybe or Promise, you depend on
 * the previous result.
 * Ordering isn't determined by the lines in the file when you don't have state.
 * All dependencies are _explicit_.
 *
 * do notation really just connects each line with a chain call
 *   -- or bind, as it’s known in Haskell/PureScript
 *
 * Remove all state w/ fantasy-io:
 * https://github.com/fantasyland/fantasy-io
 *
 * http://www.tomharding.me/2017/05/15/fantas-eel-and-specification-13/
 */

import { Maybe, Just, Nothing } from './Maybe';
import { Either, Left, Right } from './Either';
import { BTree } from './BTree';

import {
  Sum, Product, Any, All, First, Last, Min, Max
} from './Semigroup';

import { Compose } from './Compose';
import { Pair } from './Pair';

import { patchArray } from './Array';
import { patchBuiltins } from './Number';
patchArray();
patchBuiltins();

// prop :: String -> StrMap a -> Maybe a
const prop = k => xs =>
  k in xs
    ? Just(xs[k])
    : Nothing;

const map = f => xs => xs.map(f);

const ap = self => other =>
  other.chain(f => self.map(f));

describe('Chain', () => {
  test('Maybe', () => {
    const data = { a: { b: { c: 2 } } };

    expect(
      prop ('a') (data)
      .chain(prop ('b'))
      .chain(prop ('c'))
    ).toEqual(Just(2));

    // or
    expect(
      prop ('a') (data)
      .map(prop ('b')).join()
      .map(prop ('c')).join()
    ).toEqual(Just(2));

    expect(
      prop ('b') (data)
    ).toEqual(Nothing);

  });

  test('Maybe', () => {
    const sqrt = x => x < 0
      ? Left('D:')
      : Right(Math.sqrt(x));

    const inverse = x => -x;

    expect(
      Right(16)
      .chain(sqrt)
      .chain(sqrt)
    ).toEqual(Just(2));

    expect(
      Right(16)
      .chain(sqrt)
      .map(inverse)
      .chain(sqrt)
    ).toEqual(Left('D:'));

    expect(
      Left('leftie')
      .chain(sqrt)
    ).toEqual(Left('leftie'));
  });

  test('Tree traversal', () => {
    const flights = {
      ATL: ['LAX', 'DFW'],
      ORD: ['DEN'],
      LAX: ['JFK', 'ATL'],
      DEN: ['ATL', 'ORD', 'DFW'],
      JFK: ['LAX', 'DEN']
    };

    const whereNext = code => flights[code] || [];

    expect(
      whereNext('DEN')
      .chain(whereNext)
      .chain(whereNext)
    ).toEqual(['JFK', 'ATL', 'ATL', 'ORD', 'DFW']);
  });

  test('loop-like', () => {
    // eek
    const range = (from, to) =>
      Array.from(Array(to - from))
        .map((_, i) => i + from);

    const NumberPair = Pair (Number);

    const factors = n =>
      range(1, n).chain(a =>
        range(1, a).chain(b =>
          a * b !== n
          ? []
          : [NumberPair (b, a)]
        ));

    expect(
      factors(2 * 3 * 5)
    ).toEqual([
      NumberPair(5, 6),
      NumberPair(3, 10),
      NumberPair(2, 15),
    ]);
  });
});
