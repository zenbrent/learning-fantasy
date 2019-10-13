import { tagged } from "daggy";

export const Equivalence = tagged("Equivalence", ["f"]);

Equivalence.prototype.contramap = function (g) {
  return Equivalence(
    x => y => this.f (g(x)) (g(y))
  );
}


export const caseInsensitiveSearch = Equivalence(x => y => x === y)
  .contramap(x => x.replace(/\W+/g, ""))
  .contramap(x => x.toLowerCase());


