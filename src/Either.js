import { taggedSum } from 'daggy';

export const Either = taggedSum('Either', {
  Left: ['val'],
  Right: ['val']
});

export const { Left, Right } = Either;

Either.prototype.map = function (f) {
  return this.cata({
    Left: val => Left(f(val)),
    Right: val => Right(f(val))
  });
}


Either.prototype.ap = function (that) {
  return this.cata({
    Left: Left,
    Right: right1 => that.cata({
      Left: Left,
      Right: right2 => Right(right2(right1))
    })
  });
}

// Alt
// alt :: Either a ~> Either b -> Either 
Either.prototype.alt = function (that) {
  return this.cata({
    Left: () => that,
    Right: () => this
  });
}

// Applicative
Either.of = Right;
