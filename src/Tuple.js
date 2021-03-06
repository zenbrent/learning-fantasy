import { tagged } from 'daggy';

export const Tuple = tagged('Tuple', ['a', 'b']);

// Tuple is only a semigroup when it's contents
// are semigroups.
Tuple.prototype.concat = function (that) {
  return Tuple(
    this.a.concat(that.a),
    this.b.concat(that.b),
  );
}

// Fucking javascript
export const TupleMonoid = (TypeA, TypeB) => {
  const Tuple = tagged('TupleMonoid', ['a', 'b']);

  // Tuple is only a semigroup when it's contents
  // are semigroups.
  Tuple.prototype.concat = function (that) {
    return Tuple(
      this.a.concat(that.a),
      this.b.concat(that.b),
    );
  }

  Tuple.empty = () => Tuple(
    TypeA.empty(),
    TypeB.empty(),
  )

  return Tuple;
}

export const TupleApplicative = T => {
  const Tuple = tagged('TupleApplicative', ['a', 'b']);

  // Tuple is only a semigroup when it's contents
  // are semigroups.
  Tuple.prototype.concat = function (that) {
    return Tuple(
      this.a.concat(that.a),
      this.b.concat(that.b),
    );
  }

  Tuple.of = x => Tuple(
    T.empty(),
    x
  );

  return Tuple;
}

export const Tuple3 = tagged('Tuple4', ['a', 'b', 'c']);

Tuple3.prototype.concat = function (that) {
  return Tuple3(
    this.a.concat(that.a),
    this.b.concat(that.b),
    this.c.concat(that.c),
  );
}

export const Tuple4 = tagged('Tuple4', ['a', 'b', 'c', 'd']);

Tuple4.prototype.concat = function (that) {
  return Tuple4(
    this.a.concat(that.a),
    this.b.concat(that.b),
    this.c.concat(that.c),
    this.d.concat(that.d),
  );
}

