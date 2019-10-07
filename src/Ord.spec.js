/**
 * Ord: Total ordering
 * Ords must be a Setoid
 * lte aka <= :: Ord a => a ~> a -> Boolean
 *
 * Laws:
 * Totality: a.lte(b) || b.lte(a) == true
 * Antisymmetry: a.lte(b) && b.lte(a) == a.equals(b)
 * Transitivity: a.lte(b) && b.lte(c) == a.lte(c)
 *
 * http://www.tomharding.me/2017/04/09/fantas-eel-and-specification-3.5/
 */

import { List } from './List';
import { Bool } from './Bool';
import { Set_, nub } from './Set';
import { patchNumber } from './Number';
import { Coord, Line, Shape } from './Shapes';

patchNumber();

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


describe('Ord', () => {
  describe('Number_', () => {
    const n3 = 3;
    const n4 = 4;

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
    const list1 = List.from([1, 6, 3]);
    const list2 = List.from([1, 5, 3]);
    const list3 = List.from([1]);

    expect(list1.lte(list2)).toBe(false);
    expect(list2.lte(list1)).toBe(true);

    expect(list2.lte(list3)).toBe(false);
    expect(list3.lte(list2)).toBe(true);
  });

  test.skip('exercises', () => {
    // ya, I didn't do bubble sort.
    // maybe TODO:
    // make Set more efficient by using a
    // sorted list
  });
});

