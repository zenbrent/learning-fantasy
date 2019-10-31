export const ap = self => other =>
  other.chain(f => self.map(f));


export const genericApImpl = function (that) {
  return ap (this) (that);
}
