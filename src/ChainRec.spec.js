/**
 * ChainRec
 *
 * Laws:
 *
 *
 * Intuition:
 *
 * 
 */

import { taggedSum } from 'daggy';
import Pair from 'sanctuary-pair';
import { chain, chainRec, ap } from 'sanctuary';

import { Maybe, Just, Nothing } from './Maybe';
import { Either, Left, Right } from './Either';
import { BTree } from './BTree';

import {
  Sum, Product, Any, All, First, Last, Min, Max
} from './Semigroup';

import { Compose } from './Compose';
/* import { Pair } from './Pair'; */

import { patchArray } from './Array';
import { patchBuiltins } from './Number';
patchArray();
patchBuiltins();

// Could make this a Functor over a
const { Loop, Done } = taggedSum('Step', {
  Loop: ['a'],
  Done: ['b']
});

// chainRec :: ChainRec m
//          => (a -> m (Step b a), a)
//          -> m b

describe('Chain', () => {
  const Writer = Pair;

  const seq = upper => {
    const seq_ = init => init >= upper
      ? Writer ([init]) (upper)
      : chain (seq_) (Writer ([init]) (init + 1));

    return seq_(1);
  };

  test('Writer', () => {
    expect(
      seq(5)
    ).toEqual(
      Pair ([1, 2, 3, 4, 5]) (5)
    );
    // but can't do:
    // seq(5000)
    // w/o stack overflow
  });

});

describe('ChainRec', () => {
  // chainRec for pair
  const chainRec = T => f => init => {
    let acc = T.empty();
    let step = Loop(init);

    do {
      const result = f(step.a);
      acc = acc.concat(result.fst);
      step = result.snd;
    } while (Loop.is(step));

    return Pair (acc) (step.b);
  }

  test('Writer 2', () => {
    const Writer = Pair;

    const seq = upper => chainRec (Array) (
      init => {
        const next = init + 1;
        return Writer ([next]) (next >= upper ? Done(next) : Loop(next));
      }
    ) (0);

    expect(
      seq(5)
    ).toEqual(
      Pair ([1, 2, 3, 4, 5]) (5)
    );

    expect(
      seq(5000).fst
    ).toHaveLength(
      5000
    );
  });
});

