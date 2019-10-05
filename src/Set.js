import { tagged, taggedSum } from 'daggy';


// indexOf using .equals, ends at max as
// a performance optimization
const indexOf = xs => max => x => {
  for (let i = 0; i <= max; i++)
    if (xs[i].equals(x))
      return i;
  return -1;
};
// nub (aka uniq) :: Setoid a -> [a] -> [a]
export const nub = xs => xs.filter(
  (x, i) => indexOf(xs)(i)(x) === i
);

export const Set_ = tagged('Set_', []);

Set_.from = function (xs) {
  return xs.reduceRight(
    (s, x) => s.add(x),
    Set_()
  );
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

