export function patchArray () {
  // Monoid
  Array.empty = () => [];

  // Apply -- cartesian product
  Array.prototype.ap = function (fs) {
    return fs.flatMap(f => this.map(f));
  }

  // Applicative
  Array.of = x => [x];
}
