/**
 * Setoid: equivalence
 * equals :: Setoid a => a ~> a -> Boolean
 */

import { tagged } from 'daggy';

import { List } from './List';
import { Bool } from './Bool';
import { Set_, nub } from './Set';
import { Number_ } from './Number';

import { Coord, Line, Shape } from './Shapes';

const notEquals = x => y => !x.equals(y);

describe('setoid', () => {
  test('Coord', () => {
    const point1 = Coord(1,2,3);
    const point2 = Coord(1,2,3);
    const point3 = Coord(1,4,3);
    expect(point1.equals(point2)).toBe(true);
    expect(point1.equals(point3)).toBe(false);
  });

  test('Line', () => {
    const point1 = Coord(1,2,3);
    const point2 = Coord(1,3,3);
    const line1 = Line(point1, point2);
    const line2 = Line(point1, point2);
    const line3 = Line(point2, point2);
    expect(line1.equals(line2)).toBe(true);
    expect(line1.equals(line3)).toBe(false);
  });

  test('Bool', () => {
    expect(Bool.True.equals(Bool.True)).toBe(true);
    expect(Bool.False.equals(Bool.False)).toBe(true);
    expect(Bool.True.equals(Bool.False)).toBe(false);
    expect(Bool.False.equals(Bool.True)).toBe(false);
  });

  test('List', () => {
    const list1 = List.from([1,2,3]).map(Number_);
    const list2 = List.from([1,2,3]).map(Number_);
    const list3 = List.from([1,2,9]).map(Number_);
    expect(list1.equals(list2)).toBe(true);
    expect(list1.equals(list3)).toBe(false);
    expect(notEquals(list1)(list3)).toBe(true);
  });

  test('nub', () => {
    const uniq = nub(
      [5,1,2,3,3,4,4,5].map(x => Number_(x))
    )
      .map(x => x.value);
    expect(uniq).toEqual([5, 1, 2, 3, 4]);
  });

  test('set', () => {
    const s = Set_.from(
      [1,2,3,3,3].map(x => Number_(x))
    );
    expect(s.toArray().map(n => n.value))
      .toEqual([1,2,3]);

    s.remove(Number_(2));
    expect(s.toArray().map(n => n.value))
      .toEqual([1,3]);
  })
});
