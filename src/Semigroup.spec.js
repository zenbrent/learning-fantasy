/**
 * Semigroup
 * concat :: Semigroup a => a ~> a -> a
 *
 * Laws:
 * Associativity:
 * a.concat(b).concat(c) === a.concat(b.concat(c))
 *
 * http://www.tomharding.me/2017/03/13/fantas-eel-and-specification-4/
 */

import { Customer } from './Customer';
import { Tuple } from './Tuple';
import { List } from './List';
import { Bool } from './Bool';
import { Set_ } from './Set';
import { patchBuiltins } from './Number';
import { Coord, Line, Shape } from './Shapes';
import { Sum, Product, Any, All, First, Last, SetSemigroup } from './Semigroup';
import { Just, Nothing } from './Maybe';

import { concat } from 'sanctuary';

patchBuiltins();


describe('Semigroup', () => {
  test('String', () => {
    // String is already a semigroup!
    const chained = concat(concat('hi')('world'))('!');
    const composed = concat('hi')(concat('world')('!'));
    expect(chained).toEqual('hiworld!');
    expect(chained).toEqual(composed);
  });

  test('Array', () => {
    // Also already a semigroup
    const chained = [1,2,3].concat([4,5,6]).concat([7,8,9]);
    const composed = [1,2,3].concat([4,5,6].concat([7,8,9]));
    expect(chained).toEqual(composed);
  });

  describe('Numbers', () => {
    test('Sum', () => {
      const { val } = Sum(1).concat(Sum(2));
      expect(val).toBe(3);
    });

    test('Product', () => {
      const { val } = Product(2).concat(Product(2));
      expect(val).toBe(4);
    });
  });

  describe('Booleans', () => {
    test('Any', () => {
      expect(
        Any(true).concat(Any(false)).val
      ).toBe(true);

      expect(
        Any(false).concat(Any(false)).val
      ).toBe(false);
    });

    test('All', () => {
      expect(
        All(true).concat(All(false)).val
      ).toBe(false);

      expect(
        All(true).concat(All(true)).val
      ).toBe(true);
    });
  });

  test('First & Last', () => {
    expect(
      First('a').concat(First('b')).concat(First('c')).val
    ).toBe('a');

    expect(
      Last('a').concat(Last('b')).concat(Last('c')).val
    ).toBe('c');
  });

  test('Set', () => {
    const s1 = Set_.from([1,2,3,4]);
    const s2 = Set_.from([4,5,6,7]);
    const s3 = s1.concat(s2).toArray();
    expect(s3).toEqual(
      [1,2,3,4,5,6,7]
    );
  });

  test('SetSemigroup', () => {
    const s1 = SetSemigroup([1,2,3,4]);
    const s2 = SetSemigroup([4,5,6,7]);
    const { val } = s1.concat(s2)
    expect(val).toEqual(
      [1,2,3,4,5,6,7]
    );
  });

  describe('Tuple', () => {
    test('Semigroup', () => {
      expect(
        Tuple(Sum(1), Any(false))
        .concat(
          Tuple(Sum(5), Any(true))
        )
      ).toEqual(
        Tuple(Sum(6), Any(true))
      )
    });
  });

  describe('Customer', () => {
    const regDate = Date.now() - 1000;

    const brent1 = Customer(
      'brent',
      Set_.from(['coffee', 'dance']),
      regDate,
      false
    );

    const brent2 = Customer(
      'brent',
      Set_.from(['dance', 'wine']),
      Date.now(),
      true
    );

    expect(
      brent1.concat(brent2)
    ).toEqual(
      Customer(
        'brent',
        Set_.from(['coffee', 'dance', 'wine']),
        regDate,
        true
      )
    );
  });

  describe('Maybe', () => {
    expect(Just([1]).concat(Just([2])))
      .toEqual(Just([1, 2]));

    expect(Just([1]).concat(Nothing))
      .toEqual(Just([1]));

    expect(Nothing.concat(Just([2])))
      .toEqual(Just([2]));

    expect(Nothing.concat(Nothing))
      .toEqual(Nothing);
  });
});

