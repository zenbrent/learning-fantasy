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
}
