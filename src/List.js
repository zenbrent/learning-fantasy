import { tagged, taggedSum } from 'daggy';

export const List = taggedSum('List', {
  Cons: ['head', 'tail'],
  Nil: []
});

List.prototype.map = function (f) {
  return this.cata({
    Cons: (head, tail) => List.Cons(
      f(head), tail.map(f)
    ),
    Nil: () => List.Nil
  })
};

List.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => List.Cons(x, acc),
    List.Nil
  );
}

List.prototype.toArray = function () {
  return this.cata({
    Cons: (x, acc) => [
      x, ...acc.toArray()
    ],
    Nil: () => []
  })
}

