/**
 * Ord: Total ordering
 * Ords must be a Setoid
 * lte aka <= :: Ord a => a ~> a -> Boolean
 */

import { tagged } from 'daggy';

import { List } from './List';
import { Bool } from './Bool';
import { Set_, nub } from './Set';

import { Coord, Line, Shape } from './Shapes';

const gt = (x, y) =>
  !x.lte(y) &&
  !x.equals(y);

const gte = (x, y) =>
  !x.lte(y) ||
  x.equals(y);

const lt = (x, y) =>
  !gt(x, y);

const lte = (x, y) =>
  !gte(x, y);

const Number_ = tagged('Number_', ['value']);
// Setoid
Number_.prototype.equals = function (that) {
  return this.value == that.value;
}
// Ord
Number_.prototype.lte = function (that) {
  return this.value <= that.value;
}

describe('Ord', () => {
  describe('Number_', () => {
    const n3 = Number_(3);
    const n4 = Number_(4);

    test('lte', () => {
      expect(n3.lte(n4)).toBe(true);
      expect(n4.lte(n3)).toBe(false);
      expect(n3.lte(n3)).toBe(true);
    });

    test('gt', () => {
      expect(gt(n3, n4)).toBe(false);
      expect(gt(n4, n3)).toBe(true);
      expect(gt(n3, n3)).toBe(false);
    });

    test('gte', () => {
      expect(gte(n3, n4)).toBe(false);
      expect(gte(n4, n3)).toBe(true);
      expect(gte(n3, n3)).toBe(true);
    });

    test('lt', () => {
      expect(lte(n3, n4)).toBe(true);
      expect(lte(n4, n3)).toBe(false);
      expect(lte(n3, n3)).toBe(false);
    });
  });

  test('List', () => {
    const list1 = List.from([1, 6, 3])
      .map(Number_);
    const list2 = List.from([1, 5, 3])
      .map(Number_);

    expect(list1.lte(list2)).toBe(false);
    expect(list2.lte(list1)).toBe(true);
  });
});

