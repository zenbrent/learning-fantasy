// fold :: (Foldable f, Monoid m)
//      => (a -> m) -> f a -> m
//
// Only works for Functors where you know the inner type -
// e.g. functions don't work

export const fold = M => xs => xs.reduce
  (acc => x => acc.concat(M(x)))
  (M.empty());
