import { tagged } from 'daggy';

import { Tuple4 } from './Tuple';

import { merge, First, Min, Any } from './Semigroup';

export const Customer = tagged('Customer', [
  'name', // string
  'favoriteThings', // [string]
  'registrationDate', // Int from epoch
  'hasMadePurchase' // Bool
]);

const concatStrategy = {
  to: customer => Tuple4(
    First(customer.name),
    customer.favoriteThings,
    Min(customer.registrationDate),
    Any(customer.hasMadePurchase)
  ),
  from: ({ a, b, c, d }) =>
    Customer(
      a.val,
      b,
      c.val,
      d.val
    )
}

Customer.prototype.concat = function (that) {
  return merge(concatStrategy)(this)(that);
}

