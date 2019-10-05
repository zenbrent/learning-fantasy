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

// setoid
List.prototype.equals = function (that) {
  return this.cata({
    Cons: (head, tail) => (
      head.equals(that.head) &&
      tail.equals(that.tail)
    ),
    Nil: () => that.is(List.Nil)
  });
}

// Ord
List.prototype.lte = function (that) {
  return this.cata({
    Cons: (head, tail) =>
      that.cata({
        Cons: (head_, tail_) => (
          head.equals(head_)
            ? tail.lte(tail_)
            : head.lte(head_)
        ),
        Nil: () => false
      }),
    Nil: true
  })
}

// Utils
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

