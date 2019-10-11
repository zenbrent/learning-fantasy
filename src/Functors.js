import { tagged, taggedSet } from 'daggy';

const Maybe = taggedSet('Maybe', {
  Just: ['val'],
  Nothing
});

const Either = taggedSet('Either', {
  Left: ['val'],
  Right: ['val'],
});

