/**
 * Monoid
 *
 * Laws:
 *
 * http://www.tomharding.me/2017/03/21/fantas-eel-and-specification-5/
 */

import { Customer } from './Customer';
import { Tuple } from './Tuple';
import { List } from './List';
import { Bool } from './Bool';
import { Set_ } from './Set';
import { patchBuiltins } from './Number';
import { Coord, Line, Shape } from './Shapes';
import { Sum, Product, Any, All, First, Last, SetSemigroup } from './Semigroup';

patchBuiltins();

describe('Monoid', () => {
  test.skip('', () => {
  });
});

