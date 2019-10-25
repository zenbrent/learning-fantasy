import { lift2 } from './lift';

// append :: a -> [a] -> [a]
const append = y => xs => xs.concat([y])

export function patchArray () {
  // Monoid
  Array.empty = () => [];

  // Apply -- cartesian product
  Array.prototype.ap = function (fs) {
    return fs.flatMap(f => this.map(f));
  }

  // Plus
  Array.empty = () => [];

  // Applicative
  Array.of = x => [x];


  // Traversable
  Array.prototype.traverse = function (T) {
    return f => {
      return this.reduce(
        //    Here's the map bit! vvvv
        (acc, x) => lift2 (append) (f(x)) (acc),
        T.of([]))
    }
  }

}
