import { tagged } from 'daggy';
import { nub } from './Set';

// Semigroup types for numbers
export const Sum = tagged('Sum', ['val']);
Sum.prototype.concat = function (that) {
  return Sum(this.val + that.val);
};

export const Product = tagged('Product', ['val']);
Product.prototype.concat = function (that) {
  return Product(this.val * that.val);
};

// Semigroup types for booleans
export const Any = tagged('Any', ['val']);
Any.prototype.concat = function (that) {
  return Any(this.val || that.val);
};

export const All = tagged('All', ['val']);
All.prototype.concat = function (that) {
  return All(this.val && that.val);
};

// Any inner type
export const First = tagged('First', ['val']);
First.prototype.concat = function (that) {
  return this;
};

export const Last = tagged('Last', ['val']);
Last.prototype.concat = function (that) {
  return that;
};

export const Min = tagged('Min', ['val']);
Min.prototype.concat = function (that) {
  return Min(
    Math.min(this.val, that.val)
  );
};

// Inner type constrained to be a Setoid
export const SetSemigroup = tagged('SetSemigroup', ['val']);
SetSemigroup.prototype.concat = function (that) {
  return SetSemigroup(
    nub(
      this.val.concat(that.val)
    )
  );
}

// merge :: Semigroup m
//       => { to   :: a -> m
//          , from :: m -> a }
//       -> a -> a -> a
export const merge = strategy => x => y =>
  strategy.from(
    strategy.to(x).concat(
      strategy.to(y)
    )
  );

export const mergeMany = strategy => initial =>
  values => values.reduce(
    merge(strategy),
    initial
  );

