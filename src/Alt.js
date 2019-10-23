import { tagged } from 'daggy';

// value MUST be an Alt.
export const Alt = tagged('Alt', ['value']);

// Semigroup
Alt.prototype.concat = function (that) {
  return Alt(this.value.alt(that.value));
}

export function Plus (T) {
  // value must implement Plus
  const Plus = tagged('Plus', ['value']);

  // Plus is a Semigroup
  Plus.prototype.concat = function (that) {
    return Plus(this.value.alt(that.value));
  }

  // and a Monoid!
  Plus.prototype.empty = () => Plus(T.zero());

  return Plus;
}

