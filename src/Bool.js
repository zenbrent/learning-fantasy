import { tagged, taggedSum } from 'daggy';

// Tagged sum: a type with multiple constructors:
export const Bool = taggedSum('Bool', {
  True: [],
  False: []
});

Bool.prototype.invert = function () {
  this.cata({
    True: () => Bool.False,
    False: () => Bool.True
  })
}

// setoid
Bool.prototype.equals = function (that) {
  return this.is(Bool.True) ===
    that.is(Bool.True);
}
