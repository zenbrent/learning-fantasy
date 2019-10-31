/***********************************
 * Traversable
 * traverse :: Applicative f, Traversable t
 *          => t a -> (TypeRep f, a -> f b)
 *             -> f (t b)
 *
 * Laws:
 * Identity:
 * u.traverse(F, F.of) == F.of(u)
 *
 * Naturality: // a function that transforms one functor to another w/o
 *             // touching the inner value is a "natural transformation"
 * Given 2 Applicatives, F and G
 * and a function t :: F a -> G a (does nothing but change the Applicative)
 * t(u.sequence(F)) == u.traverse(G, t);
 * 
 * Travserse should behave the same way regardless of the inner Applicative.
 *
 * Composition:
 * const Comp = Compose (F) (G);
 *
 * // t (F (G a)) -> Compose F G (t a)
 * u.map(Comp).sequence(Comp) ==
 *   Comp(
 *     u.sequence(F).map(x => x.sequence(G))
 *   )
 * i.e. you can Compose the Applicative inside the Traversable _then_ sequence
 * or sequence _then_ compose.
 *
 *
 * Intuition:
 * a Traversable knows how to rebuild itself. It tears itself apart,
 * list each part into the Applicative, and reassambles itself.
 * of + ap puts the pieces into the Applicative.
 *
 * Anything that can be mapped & reduced can prob be traversed.
 *
 * http://www.tomharding.me/2017/05/08/fantas-eel-and-specification-12/
 */


import { Maybe, Just, Nothing } from './Maybe';
import { Either, Left, Right } from './Either';
import { BTree } from './BTree';

import {
  Sum, Product, Any, All, First, Last, Min, Max
} from './Semigroup';

import { Compose } from './Compose';

import { patchArray } from './Array';
import { patchBuiltins } from './Number';
patchArray();
patchBuiltins();

const map = f => xs => xs.map(f);

// if only need to flip types, use sequence
const sequence = T => xs =>
  xs.traverse (T) (x => x);


const toChar = n =>
  n < 0 || n > 25
  ? Left(n + ' is out of bounds!')
  : Right(String.fromCharCode(n + 65));

describe('Traversable', () => {
  describe('BTree', () => {
    test('identity', () => {
      expect(
        BTree.of([1])
        .equals([1].traverse (BTree) (BTree.of))
      ).toBe(true);

      expect(
        BTree.of([1, 2, 3])
        .equals([1, 2, 3].traverse (BTree) (BTree.of))
      ).toBe(true);
    });

    test('naturality', () => {
      const maybeToEither = m => m.cata({
        Just: val => Right(val),
        Nothing: () => Left('nothing')
      });
      expect(
        maybeToEither(
          [Just(1), Just(2), Just(3)].sequence (Maybe)
        ).equals(
          [Just(1), Just(2), Just(3)].traverse (Either) (maybeToEither)
        )
      ).toBe(true);
    });


  });

  test('Either Array', () => {
    // inside out
    expect(
      sequence (Either) ([Right(1), Right(2), Right(3)]),
    ).toEqual(Right([1, 2, 3]));

    expect(
      [Left(1), Left(2), Right(3)].traverse (Either) (x => x.cata({ Left: Right, Right: Left}))
    ).toEqual(Left(3));

    const alphabet = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    const calculatedAlphabet = Array(26).fill(0).map((_, i) => i)
      .traverse (Either) (toChar);

    expect(
      calculatedAlphabet
    ).toEqual(Right(alphabet));

    const alphabetError = Array(27).fill(0).map((_, i) => i)
      .traverse (Either) (toChar);

    expect(
      alphabetError
    ).toEqual(Left('26 is out of bounds!'));

    // Get all the values or errors
    const calculatedWithErrors = Array(4).fill(0).map((_, i) => i + 24)
      .map(toChar)

    expect(
      calculatedWithErrors
      .map(map(x => [x]))
      .reduce((acc, x) => acc.concat(x), Right([]))
    ).toEqual(Right(['Y', 'Z']));

    expect(
      calculatedWithErrors
      .map(x => x.inverse())
      .map(map(x => [x]))
      .reduce((acc, x) => acc.concat(x), Right([]))
    ).toEqual(Right([
      '26 is out of bounds!',
      '27 is out of bounds!'
    ]));

  });

  test('Maybe', () => {
    // Into an array
    expect(
      [1, 2, 3, 4, 5].traverse (Maybe) (a => Just(a + 1))
    ).toEqual(Just([2, 3, 4, 5, 6]));

    // Make it Nothing
    expect(
      [1, 2, 3, 4, 5].traverse (Maybe) (a => a === 3 ? Nothing : Just(a + 1))
    ).toEqual(Nothing);

    expect(
      Just(5).traverse (Array) (x => [x + 1, x + 2])
    ).toEqual([Just(6), Just(7)]);
  });

});
