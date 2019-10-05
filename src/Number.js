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
export function patchNumber () {
  // Setoid
  Number.prototype.equals = function (that) {
    return this === that;
  }

  // Ord
  Number.prototype.lte = function (that) {
    return this <= that;
  }
}
