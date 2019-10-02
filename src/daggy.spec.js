import { tagged, taggedSum } from 'daggy';
import { List } from './List';

const Coord = tagged('Coord', ['x', 'y', 'z']);

Coord.prototype.translate = function (x, y, z) {
  return Coord(
    this.x + x,
    this.y + y,
    this.z + z
  );
}

const Line = tagged('Line', ['from', 'to']);

// Shape isn't a constructor, it's a type
const Shape = taggedSum('Shape', {
  // Square :: (Coord, Coord) -> Shape
  Square: ['topleft', 'bottomright'],

  // Circle :: (Coord, Number) -> Shape
  Circle: ['center', 'radius']
});

Shape.prototype.translate = function (x, y, z) {
  return this.cata({
    Square: (topleft, bottomright) => {
      return Shape.Square(
        topleft.translate(x, y, z),
        bottomright.translate(x, y, z)
      );
    },
    Circle: (center, radius) => {
      return Shape.Circle(
        center.translate(x, y, z),
        radius
      )
    }
  })
}

// Tagged sum: a type with multiple constructors:
const Bool = taggedSum('Bool', {
  True: [],
  False: []
});

Bool.prototype.invert = function () {
  this.cata({
    True: () => Bool.False,
    False: () => Bool.True
  })
}

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
