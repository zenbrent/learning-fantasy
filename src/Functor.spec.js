/**
 * Functor
 * map :: Functor f => f a ~> (a -> b) -> f b
 *
 * Laws:
 * Identity:
 * u.map(x => x) == u
 *
 * Composition:
 * u.map(f).map(g) == u.map(x => f(g(x)))
 *
 * Intuition:
 * Sets aren't functors -- their inner type must
 * be a semigroup, and functors don't restrict
 * the contents to be semigroups.
 * Functor extends the language into a world.
 * Putting the fn in that world is called "lifting" it.
 *
 * http://www.tomharding.me/2017/03/27/fantas-eel-and-specification-6/
 */

import { Customer } from './Customer';
import { Tuple, TupleMonoid } from './Tuple';
import { List } from './List';
import { Bool } from './Bool';
import { patchBuiltins } from './Number';
import { Coord, Line, Shape } from './Shapes';
import {
  foldL, foldR,
  Sum, Product, Any, All, First, Last, Min, Max
} from './Semigroup';
import { foldLP } from './ParallelFold';

patchBuiltins();

describe('Functor', () => {
  test('', () => {
  });
});
