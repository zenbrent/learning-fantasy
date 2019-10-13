import { tagged, taggedSum } from 'daggy';

import { Equivalence } from './Equivalence';

const addTo = (a, b) => a.add(b);

const isEq = Equivalence(x => y => x.equals(y));

// indexOf using .equals, ends at max as
// a performance optimization
const indexOf = equivalence => xs => max => x => {
  const eq = equivalence.f(x);
  for (let i = 0; i <= max; i++)
    if (eq(xs[i]))
      return i;
  return -1;
};

export const unique = equivalence => xs => xs.filter(
  (x, i) => indexOf(equivalence)(xs)(i)(x) === i
);

// nub (aka uniq) :: Setoid a -> [a] -> [a]
export const nub = unique(isEq);

export const Set_ = tagged('Set_', []);

Set_.from = function (xs) {
  return xs.reduceRight(addTo, Set_());
}

Set_.prototype.toArray = function () {
  return this.arr;
}

Set_.prototype.add = function add (value) {
  if (!this.arr)
    this.arr = [];
  this.arr = nub([value, ...this.arr]);
  return this;
}

Set_.prototype.remove = function remove (value) {
  this.arr = this.arr.filter(x => !x.equals(value));
  return this;
}

Set_.prototype.concat = function remove (that) {
  return this.arr.reduceRight(
    addTo,
    that.arr.reduceRight(
      addTo,
      Set_()
    )
  );
}

