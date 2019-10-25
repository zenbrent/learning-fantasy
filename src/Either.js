import { taggedSum } from 'daggy';

// import Either from 'data.either';
// export { Either };
// export const { Left, Right } = Either;

export const Either = taggedSum('Either', {
  Left: ['val'],
  Right: ['val']
});

export const { Left, Right } = Either;

Either.prototype.map = function (f) {
  return this.cata({
    Left: () => this,
    Right: val => Right(f(val))
  });
}


Either.prototype.ap = function (that) {
  return this.cata({
    Left: () => this,
    Right: val1 => that.cata({
      Left: () => that,
      Right: val2 => Right(val2(val1))
    })
  });
}

// Alt
// alt :: Either a ~> Either b -> Either
Either.prototype.alt = function (that) {
  return that.cata({
    Left: () => this,
    Right: () => that
  });
}

Either.prototype.reduce = function (f) {
  return acc => this.cata({
    Left: f(acc),
    Right: () => acc
  })
}


// Applicative
Either.of = Right;
