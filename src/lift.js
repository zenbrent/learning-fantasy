export const lift2 = f => a => b =>
  b.ap(a.map(f));

export const lift3 = f => a => b => c =>
  c.ap(b.ap(a.map(f)))

export const lift4 = f => a => b => c => d =>
  d => d.ap(c.ap(b.ap(a.map(f))))

export const liftN = n => f => a => {
  const apps = [];
  return function _liftN (v) {
    apps.push(v);
    if (apps.length + 1 !== n)
      return _liftN;
    else
      return apps.reduce(
        (acc, val) => val.ap(acc),
        a.map(f)
      );
  }
}

