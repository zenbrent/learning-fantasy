/***********************************
 * Traversable
 * traverse :: Applicative f, Traversable t
 *          => t a -> (TypeRep f, a -> f b)
 *             -> f (t b)
 *
 * Laws:
 *
 * Intuition:
 * a Traversable knows how to rebuild itself. It tears itself apart,
 * list each part into the Applicative, and reassambles itself.
 * of + ap puts the pieces into the Applicative.
 *
 *
 * http://www.tomharding.me/2017/05/08/fantas-eel-and-specification-12/
 */


import { Maybe, Just, Nothing } from './Maybe';
import { Either, Left, Right } from './Either';
import { BTree } from './BTree';

import { patchArray } from './Array';
patchArray();

const map = f => xs => xs.map(f);

// if only need to flip types, use sequence
const sequence = T => xs =>
  xs.traverse (T) (x => x);

const toChar = n =>
  n < 0 || n > 25
  ? Left(n + ' is out of bounds!')
  : Right(String.fromCharCode(n + 65));

describe('Traversable', () => {
  test('Either Array', () => {
    // inside out
    expect(
      sequence (Either) ([Right(1), Right(2), Right(3)]),
    ).toEqual(Right([1, 2, 3]));

    expect(
      [Left(1), Left(2), Right(3)].traverse (Either) (x => x.cata({ Left: Right, Right: Left}))
    ).toEqual(Left(3));


    const alphabet = Array(26).fill(0).map((_, i) => i)
      .traverse (Either) (toChar);

    expect(
      alphabet
    ).toEqual(Right([
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]));

    const alphabetWithErrors = Array(27).fill(0).map((_, i) => i)
      .traverse (Either) (toChar);

    expect(
      alphabetWithErrors
    ).toEqual(Left('26 is out of bounds!'));
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

  test.skip('BTree', () => {
  });


});
