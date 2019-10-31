import { tagged } from 'daggy';

// Compose f g a = Compose (f (g a))
//
// basically stacking 2 applicatives to form a composite Applicative.

const Compose = F => G => {
  const Compose = tagged(`Compose <${F['@@tag']}, ${G['@@tag']}>`, ['stack']);

  Compose.of = x => Compose(F.of(G.of(x)));

  // basically map(map(f))
  Compose.map = function (f) {
    return this.stack.map(x => x.map(f));
  };

  // basically lift2 (ap) (this) (fs)
  Compose.ap = function (fs) {
    return Compose(
      this.stack
        .map(x => f => x.ap(f))
        .ap(fs.stack)
    );
  };

  return Compose;
}

