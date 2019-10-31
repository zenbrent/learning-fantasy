/**
 * Chain
 *
 * Laws:
 *
 * Intuition:
 *
 * http://www.tomharding.me/2017/05/15/fantas-eel-and-specification-13/
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

describe('Chain', () => {
  test.skip('', () => {});
});
