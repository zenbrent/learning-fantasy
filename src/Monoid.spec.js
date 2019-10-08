/**
 * Monoid
 * Must be a Semigroup
 * with "identity" function
 * empty :: Monoid m => () -> m
 *
 * Laws:
 * Right identity:
 * SomeType(x).concat(SomeType.empty()) == SomeType(x))
 *
 * Left identity:
 * SomeType.empty().concat(SomeType(x)) == SomeType(x))
 *
 * Intuition:
 * Semigroup combines one or more values.
 * Monoid combines zero or more. Nice for reduce.
 * Generic way to fold any reducible structure (e.g. array, trees)
 *
 * http://www.tomharding.me/2017/03/21/fantas-eel-and-specification-5/
 */

import { Customer } from './Customer';
import { Tuple, TupleMonoid } from './Tuple';
import { List } from './List';
import { Bool } from './Bool';
import { Set_ } from './Set';
import { patchBuiltins } from './Number';
import { Coord, Line, Shape } from './Shapes';
import {
  foldL, foldR,
  Sum, Product, Any, All, First, Last, SetSemigroup, Min, Max
} from './Semigroup';
import { foldLP } from './ParallelFold';

patchBuiltins();

describe('Monoid', () => {
  const testMonoid = m => val => {
    expect(
      m(val).concat(m.empty())
    ).toEqual(m(val));

    expect(
      m.empty().concat(m(val))
    ).toEqual(m(val));
  }

  test('concat empty', () => {
    testMonoid(Sum)(5);
    testMonoid(Product)(5);
    testMonoid(String)('asdf');
    testMonoid(Array)([1,2,3]);
    testMonoid(Any)(false);
    testMonoid(Any)(true);
    testMonoid(All)(false);
    testMonoid(All)(true);
    testMonoid(Min)(-100);
    testMonoid(Min)(100);
    testMonoid(Max)(-100);
    testMonoid(Max)(100);
  });

  describe('folds', () => {
    const foldTest = M => xs => val => {
      expect(foldL(M)(xs).val).toEqual(val);
      expect(foldR(M)(xs).val).toEqual(val);
    }

    test('foldL', () => {
      foldTest(Any)([false, true, false])(true);
      foldTest(All)([false, true, false])(false);
      foldTest(Sum)([4, 5, -1])(8);
      foldTest(Sum)([])(0);
      foldTest(Product)([91, -10])(-910);
      foldTest(Product)([])(1);
    });

    test('ParallelFold', () => {
      // Numbers from 0 to 999,999
      const bigList = [... Array(1e6)].map((_, i) => i);

      expect(
        foldLP(Sum)(bigList).val
      ).toEqual(499999500000);
    })

    test('TupleMonoid', () => {
      const AnyAllTuple = TupleMonoid(Any, All);
      expect(
        AnyAllTuple.empty()
      ).toEqual(AnyAllTuple(Any(false), All(true)));
    });
  });
});

