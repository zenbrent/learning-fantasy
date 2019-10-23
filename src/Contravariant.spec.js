/**
 * Contravariant
 * contramap :: f a ~> (a -> b) -> f b
 *
 * Laws:
 * Identity:
 * U.contramap(x => x) == U
 *
 * Composition:
 * U.contramap(f).contramap(g) ==
 *   U.contramap(x => f(g(x)))
 * Composing the other way around from map
 *
 * Intuition:
 * Array isn't a contravariant - it's a covariant (regular)
 * functor.
 * Most contravariants are mappings to specific types.
 * 
 */

import { isEven, lengthIsEven } from "./Predicate";
import {
  intToString,
  stringArrayToString,
  arrayToString,
  intsToString,
  matrixToString
} from "./ToString";
import { caseInsensitiveSearch } from "./Equivalence";

// import { Customer } from "./Customer";
// import { Tuple, TupleMonoid } from "./Tuple";
// import { List } from "./List";
// import { Bool } from "./Bool";
import { patchBuiltins } from "./Number";
// import { Coord, Line, Shape } from "./Shapes";
// import {
//   foldL, foldR,
//   Sum, Product, Any, All, First, Last, Min, Max
// } from "./Semigroup";
// import { foldLP } from "./ParallelFold";

patchBuiltins();

describe("Contravariant", () => {
  test("Predicate", () => {
    expect(isEven.f(2)).toBe(true);
    expect(isEven.f(3)).toBe(false);

    expect(lengthIsEven.f("asdf")).toBe(true);
    expect(lengthIsEven.f("asd")).toBe(false);
  });

  test("toString", () => {
    expect(intToString.f(3))
      .toEqual("int(3)")

    expect(stringArrayToString.f(["a","b"]))
      .toEqual("[ a, b ]")

    expect(intsToString.f([1, 2, 3]))
      .toEqual("[ int(1), int(2), int(3) ]");

    expect(matrixToString.f([
      [1, 2],
      [3],
      [0, 0]
    ])).toEqual(
      "[ [ int(1), int(2) ], [ int(3) ], [ int(0), int(0) ] ]"
    );
  });

  test("Equivalence", () => {
    expect(
      caseInsensitiveSearch.f('asdf')('A(#Sd)F')
    ).toBe(true);


    // TODO: Use Equivalence in Setoid
  });
});

