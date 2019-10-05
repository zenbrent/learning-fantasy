import { Coord, Line, Shape } from './Shapes';
import { List } from './List';

describe('daggy', () => {
  test('tagged', () => {
    const origin = Coord(0, 0, 0);
    expect(origin.y).toEqual(0);
    const line = Line(origin, origin.translate(4,5,6));
    expect(line.to.z).toEqual(6);
  });

  test('taggedSum', () => {
    const aSquare = Shape.Square(
      Coord(0, 0, 0),
      Coord(1, 1, 1)
    );
    const movedSquare = aSquare.translate(2, 3, 4);
    expect(movedSquare.topleft.x).toEqual(2)
  });
});

describe('List', () => {
  test('creating', () => {
    const list = List.from([1, 2, 3, 4, 5]);
    expect(list.tail.tail.tail.head).toEqual(4);
  });

  test('toArray', () => {
    const arr = List.from([1, 2, 3, 4, 5]).toArray();
    expect(arr[2]).toEqual(3);
  });

  test('mapping', () => {
    const arr = List
      .from([0, 1, 2, 3])
      .map(x => x + 3)
      .toArray();

    expect(arr).toEqual([3, 4, 5, 6]);
  })
});
