import { tagged, taggedSum } from 'daggy';
import { lift2 } from './lift';

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

// Applicative
Maybe.of = Just;

// Monoid
Maybe.empty = () => Nothing;
