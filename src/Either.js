import { taggedSum } from 'daggy';

export const Either = taggedSum('Either', {
  Left: ['val'],
  Right: ['val']
});

export const { Left, Right } = Either;

Either.prototype.ap = function (that) {
  return this.cata({
    Left: left => Left(left),
    Right: right1 => that.cata({
      Left: left => Left(left),
      Right: right2 => Right(right2(right1))
    })
  });
}

