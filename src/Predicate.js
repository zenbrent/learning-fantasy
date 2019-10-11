import { tagged } from 'daggy';

export const Predicate = tagged('Predicate', ['f']);

// contramap :: Predicate a ~> (b -> a)
//                          -> Predicate b
Predicate.prototype.contramap = function (f) {
  return Predicate(
    x => this.f(f(x))
  );
}

// isEven :: Predicate Int
export const isEven = Predicate(x => x % 2 === 0);

// lengthIsEven :: Predicate String
export const lengthIsEven = isEven
  .contramap(x => x.length);

