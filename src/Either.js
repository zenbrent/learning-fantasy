import { taggedSum } from 'daggy';

// import Either from 'data.either';
// export { Either };
// export const { Left, Right } = Either;

export const Either = taggedSum('Either', {
  Left: ['val'],
  Right: ['val']
});

export const { Left, Right } = Either;


Either.prototype.concat = function (that) {
  return this.cata({
    Left: val1 => that.cata({
      Left: val2 => Left(val1.concat(val2)),
      Right: () => that
    }),
    Right: val1 => that.cata({
      Left: () => this,
      Right: val2 => Right(val1.concat(val2))
    })
  });
}

Either.prototype.inverse = function () {
  return this.cata({
    Left: Right,
    Right: Left
  });
}

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
    Left: () => acc,
    Right: f(acc)
  })
}

// Setoid
Either.prototype.equals = function (that) {
  return this.cata({
    Left: v1 => that.cata({
      Left: v2 => v1.equals(v2),
      Right: () => false,
    }),
    Right: v1 => that.cata({
      Left: () => false,
      Right: v2 => v1.equals(v2)
    }),
  })
}

Either.prototype.traverse = function (T) {
  return f => this.cata({
    Left: val => Left(T.of(val)),
    Right: val => f(val).map(x => Right(x))
  });
}


Either.prototype.chain = function (f) {
  return this.cata({
    Left: () => this,
    Right: f
  });
}

// Like sequence = traverse (identity)
// chain is join (identity)
Either.prototype.join = function () {
  return this.chain(x => x);
}


// Applicative
Either.of = Right;
