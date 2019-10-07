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

import { tagged } from 'daggy';

import { Tuple } from './List';
import { List } from './List';
import { Bool } from './Bool';
import { Set_, nub } from './Set';
import { patchNumber } from './Number';
import { Coord, Line, Shape } from './Shapes';

patchNumber();

// Semigroup types for numbers
const Sum = tagged('Sum', ['val']);
Sum.prototype.concat = function (that) {
  return Sum(this.val + that.val);
};

const Product = tagged('Product', ['val']);
Product.prototype.concat = function (that) {
  return Product(this.val * that.val);
};

// Semigroup types for booleans
const Any = tagged('Any', ['val']);
Any.prototype.concat = function (that) {
  return Any(this.val || that.val);
};

const All = tagged('All', ['val']);
All.prototype.concat = function (that) {
  return All(this.val && that.val);
};

// Any inner type
const First = tagged('First', ['val']);
First.prototype.concat = function (that) {
  return this;
};

const Last = tagged('Last', ['val']);
Last.prototype.concat = function (that) {
  return that;
};

// Inner type constrained to be a Setoid
const SetSemigroup = tagged('SetSemigroup', ['val']);
SetSemigroup.prototype.concat = function (that) {
  return SetSemigroup(
    nub(
      this.val.concat(that.val)
    )
  );
}


describe('Semigroup', () => {
  test('String', () => {
    // String is already a semigroup!
    const chained = 'hi'.concat('world').concat('!');
    const composed = 'hi'.concat('world'.concat('!'));
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

  describe.skip('Tuple', () => {

  });
});

