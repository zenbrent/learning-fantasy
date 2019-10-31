import { lift2 } from './lift';
import { genericApImpl } from './genericAp';

// append :: a -> [a] -> [a]
const append = y => xs => xs.concat([y])

// if only need to flip types, use sequence
const sequence = T => xs =>
  xs.traverse (T) (x => x);

export function patchArray () {
  // Monoid
  Array.empty = () => [];

  // Apply -- cartesian product
  Array.prototype.ap = genericApImpl;

  // Plus
  Array.empty = () => [];

  // Applicative
  Array.of = x => [x];

  // Setoid
  Array.prototype.equals = function (that) {
    if (this.length !== that.length)
      return false;

    for (let i = 0; i < this.length; i++)
      if (!this[i].equals(that[i]))
        return false;

    return true;
  }

  // Traversable
  Array.prototype.traverse = function (T) {
    return f => {
      return this.reduce(
        //    Here's the map bit! vvvv
        (acc, x) => lift2 (append) (f(x)) (acc),
        T.of([]))
    }
  }

  Array.prototype.sequence = function (T) {
    return sequence (T) (this);
  }

  Array.prototype.chain = function (f) {
    return this.flatMap(f);
  }

}
