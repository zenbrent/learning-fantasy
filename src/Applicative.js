/**
 * Applicative
 * Must be an Apply
 * of :: Applicative f => a -> f a
 *
 * Laws:
 * Identity
 * v.ap(A.of(x => x)) == v
 *
 * Homomorphism
 * A.of(x).ap(A.of(f)) = A.of(f(x)))
 *   lift a fn & arg seperately & combine them
 *   OR combine them & lift the result.
 *
 * Interchange
 * A.of(y).ap(u) == u.ap(A.of(f => f(y)))
 *   ap applies the value in the right side to
 *   the value in the left.
 *
 * Intuition:
 * Most Apply types will also be Applicatives.
 *
 * http://www.tomharding.me/2017/04/17/fantas-eel-and-specification-9/
 */

import { tagged } from 'daggy';

describe('Applicative', () => {
  test.skip('insideOut', () => {
  });
});

