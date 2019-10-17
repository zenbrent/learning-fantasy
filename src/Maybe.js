import { tagged, taggedSum } from 'daggy';

export const Maybe = taggedSum('Maybe', {
  Just: ['val'],
  Nothing: []
});

export const { Just, Nothing } = Maybe;

Maybe.prototype.ap = function (that) {
  return this.cata({
    Just: val1 => that.cata({
      Just: val2 => Just(val2(val1)),
      Nothing: () => Nothing
    }),
    Nothing: () => Nothing
  });
}

