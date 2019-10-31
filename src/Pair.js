/**
 * Often used for modeling values w/ metadata
 *
 * see http://www.tomharding.me/2017/04/27/pairs-as-functors/ for more
 * stuff on pairs
 */

import { tagged } from 'daggy';

export const Pair = T => {
  const Pair = tagged('Pair', ['_1', '_2']);

  Pair.prototype.map = function (f) {
    return Pair(this._1, f(this._2));
  }

  Pair.prototype.ap = function (fs) {
    return Pair(fs._1.concat(this._1),
      fs._2(this._2));
  }

  Pair.of = x => Pair(T.empty(), x);

  Pair.prototype.chain = function (f) {
    const that = f(this._2);

    return Pair(this._1.concat(that._1),
      that._2);
  }

  Pair.prototype.traverse = function (_) {
    return f =>
      f(this._2)
        .map(x => Pair(this._1, x));
  }

  return Pair;
}

