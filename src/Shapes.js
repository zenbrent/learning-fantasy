import { tagged, taggedSum } from 'daggy';

export const Coord = tagged('Coord', ['x', 'y', 'z']);

Coord.prototype.translate = function (x, y, z) {
  return Coord(
    this.x + x,
    this.y + y,
    this.z + z
  );
}

export const Line = tagged('Line', ['from', 'to']);

// Shape isn't a constructor, it's a type
export const Shape = taggedSum('Shape', {
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

// Implement Setoid
Coord.prototype.equals = function (that) {
  return this.x === that.x &&
    this.y === that.y &&
    this.z === that.z;
}

Line.prototype.equals = function (that) {
  return this.from.equals(that.from) &&
    this.to.equals(that.to);
}

