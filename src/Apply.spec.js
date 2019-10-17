/**
 * Apply
 * Must be a functor
 * ap :: Apply f => f a ~> f (a -> b) -> f b
 *
 * Laws:
 * x.ap(g.ap(f.map(compose)) == x.ap(g).ap(f)
 * or like this:
 * lift3(compose)(f)(g)(x) == x.ap(g).ap(f)
 *
 * Intuition:
 * map applies a function to a wrapped value,
 * ap applies a wrapped function to a wrapped value.
 * Basic function application, but in a functor.
 * Semigroup merges values, Apply merges contexts
 * (in function application)
 * 
 * Most types implement Apply using Chain
 */

import { tagged } from 'daggy';

import { Just, Nothing } from './Maybe';
import { Left, Right } from './Either';
import Task from 'data.task';
import { patchArray } from './Array';
patchArray();

const lift2 = f => a => b =>
  b.ap(a.map(f));

const lift3 = f => a => b => c =>
  c.ap(b.ap(a.map(f)))

const Identity = tagged('Identity', ['x']);

// map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function (f) {
  return Identity(f(this.x));
}

// ap :: Identity a ~> Identity (a -> b) -> Identity b
Identity.prototype.ap = function (b) {
  return Identity(b.x(this.x));
}

const add = x => y => x + y;
const pow = y => x => Math.pow(x, y);

describe('lift2', () => {
  test('Identity', () => {
    expect(
      lift2(add)
        (Identity(2))
        (Identity(3))
    ).toEqual(
      Identity(5)
    )
  });

  test('Array', () => {
    expect(
      [2,3,4].ap([])
    ).toEqual([]);

    expect(
      [2,3,4].ap([add(1)])
    ).toEqual([3,4,5]);

    expect(
      [2,3,4].ap([add(1), pow(2)])
    ).toEqual([3,4,5,4,9,16]);

    // like multidimensional loop
    expect(
      lift2(add)
        ([1, 2, 3])
        ([4, 5, 6])
    ).toEqual(
      [5, 6, 7, 6, 7, 8, 7, 8, 9]
    );
  });

  test('Maybe', () => {
    expect(Just(2).ap(Just(add(1)))).toEqual(Just(3));
    expect(Just(2).ap(Nothing)).toEqual(Nothing);
    expect(Nothing.ap(Just(add(1)))).toEqual(Nothing);
    expect(Nothing.ap(Nothing)).toEqual(Nothing);
  });

  test('Either', () => {
    const ok = () => "It's ok!";
    const leftErr = 'aaahhhh';
    const rightErr = 'oh no';
    expect(Right('ok').ap(Right(ok)))
      .toEqual(Left(ok()))
    expect(Left(leftErr).ap(Right(ok)))
      .toEqual(Left(leftErr))
    expect(Right(ok()).ap(Left(rightErr)))
      .toEqual(Left(rightErr))
    expect(Left(leftErr).ap(Left(rightErr)))
      .toEqual(Left(leftErr))
  });

  test('Task', () => {
    const fetch = url => {
      switch (url) {
        case '/users':
          return Promise.resolve([{ id: 1, name: 'brent' }]);
        case '/users':
          return Promise.resolve([{ user: 1, text: 'hi' }]);
        default:
          return 404;
      }
    }
    const getJSON = url => new Task((rej, res) =>
      fetch(url).then(res).catch(rej)
    );

    const renderPage = users => posts =>
      `${users[0].name}: ${posts[0].text}`;

    const page = lift2(renderPage)
      // do these in parallel
      (getJSON('/users'))
      (getJSON('/posts'));
  });
});

