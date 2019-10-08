import { tagged, taggedSum } from 'daggy';

import { foldL } from './Semigroup';

// TODO: make it a generator for TCO
export const chunk = xs => xs.length < 5000
  ? [xs]
  : [xs.slice(0, 5000),
    ...chunk(xs.slice(5000))
  ];

// ya sure
const runOnANewThreadOrWhatev = f => x => f(x);

const parallelMap = f => xs =>
  xs.map(runOnANewThreadOrWhatev(f));

export const foldLP = M => xs =>
  parallelMap(foldL(M))(chunk(xs))
  .reduce(
    (xs, ys) => xs.concat(ys),
    M.empty()
  );


