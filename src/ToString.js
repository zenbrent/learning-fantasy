import { tagged } from 'daggy';

export const ToString = tagged('ToString', ['f']);

function method (type, name, fn) {
  type.prototype[name] = function (...args) {
    return fn(this, ...args);
  }
}


// add a preprocessor
method(ToString, 'contramap', (self, f) =>
  ToString(x => self.f(f(x)))
)

//
export const intToString =
  ToString(x => `int(${x})`)
  .contramap(x => x | 0)

export const stringArrayToString =
  ToString(x => `[ ${x} ]`)
  .contramap(xs => xs.join(', '));

// Given an array of ToString instances,
// convert the array to a string
// arrayToString :: ToString a -> ToString [a]
export const arrayToString = t =>
  stringArrayToString
    .contramap(x => x.map(t.f));

// intsToString :: ToString [int]
export const intsToString =
  arrayToString(intToString);

// matrixToString :: ToString [int] -> ToString [[int]]
export const matrixToString =
  arrayToString(intsToString);
