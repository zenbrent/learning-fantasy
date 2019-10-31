import { tagged, taggedSum } from 'daggy';
import { lift2 } from './lift';
import { genericApImpl } from './genericAp';

const map = f => x => x.map(v => f(v));

export const Maybe = taggedSum('Maybe', {
  Just: ['val'],
  Nothing: []
});

export const { Just, Nothing } = Maybe;

// Functor
Maybe.prototype.map = function (f) {
  return this.cata({
    Just: val => Just(f(val)),
    Nothing: () => Nothing
  });
}


// Apply
Maybe.prototype.ap = function (that) {
  return this.cata({
    Just: thisVal => that.cata({
      Just: thatVal => Just(thatVal(thisVal)),
      Nothing: () => Nothing
    }),
    Nothing: () => Nothing
  });
}
//// or using chain
// Maybe.prototype.ap = genericApImpl;

// Semigroup
Maybe.prototype.concat = function (that) {
  return this.cata({
    Just: thisVal => that.cata({
      Just: thatVal => Just(thisVal.concat(thatVal)),
      Nothing: () => this
    }),
    Nothing: () => that
  });
}

// Alt
Maybe.prototype.alt = function (that) {
  return this.cata({
    Just: () => this,
    Nothing: () => that
  });
}

Maybe.prototype.reduce = function (f) {
  return acc => this.cata({
    Just: f(acc),
    Nothing: () => acc
  })
}

Maybe.prototype.traverse = function (T) {
  return f => this.cata({
    Nothing: () => T.of(Nothing),
    Just: x => map (Just) (f(x))
  });
}

Maybe.prototype.chain = function (f) {
  return this.cata({
    Nothing: () => this,
    Just: f
  });
}

// Like sequence = traverse (identity)
// chain is join (identity)
Maybe.prototype.join = function () {
  return this.chain(x => x);
}

// Plus
Maybe.zero = () => Nothing;

// Applicative
Maybe.of = Just;

// Monoid
Maybe.empty = () => Nothing;
