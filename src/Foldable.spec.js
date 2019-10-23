/***********************************
 * Foldable
 *
 * Laws:
 *
 * Distributivity
 *
 * Intuition:
 *
 *
 * http://www.tomharding.me/2017/05/01/fantas-eel-and-specification-11/
 */

import { tagged } from 'daggy';
import { Maybe, Just, Nothing } from './Maybe';
import { Left, Right } from './Either';
import { List } from './List';
import { Alt, Plus } from './Alt';
import { lift2 } from './lift';

import { patchArray } from './Array';
patchArray();

describe('Foldable', () => {
  test.skip('', () => {});
});
