import { tagged, taggedSum } from 'daggy';
import { nub } from './Set';


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


// In a decent lang, tye TypeRep would be deduced.
export const foldL = M => xs =>
  xs.reduce(
    (acc, x) => acc.concat(M(x)),
    M.empty()
  );

export const foldR = M => xs =>
  xs.reduceRight(
    (acc, x) => acc.concat(M(x)),
    M.empty()
  );

// Semigroup types for numbers
export const Sum = tagged('Sum', ['val']);

Sum.prototype.concat = function (that) {
  return Sum(this.val + that.val);
};

Sum.empty = () => Sum(0);


export const Product = tagged('Product', ['val']);

Product.prototype.concat = function (that) {
  return Product(this.val * that.val);
};

Product.empty = () => Product(1);


// Semigroup types for booleans
export const Any = tagged('Any', ['val']);

Any.prototype.concat = function (that) {
  return Any(this.val || that.val);
};

Any.empty = () => Any(false);


export const All = tagged('All', ['val']);

All.prototype.concat = function (that) {
  return All(this.val && that.val);
};

All.empty = () => All(true);


// Any inner type
export const First = tagged('First', ['val']);
// Note: not a monoid.

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

Min.empty = () => Min(Infinity);


export const Max = tagged('Max', ['val']);

Max.prototype.concat = function (that) {
  return Max(
    Math.max(this.val, that.val)
  );
};

Max.empty = () => Max(-Infinity);


// Inner type constrained to be a Setoid
export const SetSemigroup = tagged('SetSemigroup', ['val']);

SetSemigroup.prototype.concat = function (that) {
  return SetSemigroup(
    nub(
      this.val.concat(that.val)
    )
  );
}

