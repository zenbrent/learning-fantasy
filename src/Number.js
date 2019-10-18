import { tagged } from 'daggy';

export const Number_ = tagged('Number_', ['value']);

// Setoid
Number_.prototype.equals = function (that) {
  return this.value == that.value;
}

// Ord
Number_.prototype.lte = function (that) {
  return this.value <= that.value;
}

// or monkey patch Number -- not a good idea. ;)
export function patchBuiltins () {
  // Setoid
  Number.prototype.equals = function (that) {
    return this === that;
  }

  String.prototype.equals = function (that) {
    return this === that;
  }

  // Semigroup
  Function.prototype.concat = function (that) {
    return x => this(x).concat(that(x));
  }

  // Monoid
  String.empty = () => "";

  // see https://joneshf.github.io/programming/2014/09/24/FizzBuzz-With-Semigroups-And-Apply.html
  // Function.prototype.empty // fucking javascript.. needs a TypeRep

  // Ord
  Number.prototype.lte = function (that) {
    return this <= that;
  }

  // Applicative
  Function.of = x => () => x;
}
