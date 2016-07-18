'use strict';

var locateZeros = require('./src/locate-zeros');

module.exports = delvesLyness;

function delvesLyness (f, fp, z0, r, tol, maxDepth) {
  z0 = z0 === undefined ? [0, 0] : z0;
  r = r === undefined ? 1 : r;
  maxDepth = maxDepth === undefined ? 20 : maxDepth;
  tol = tol === undefined ? 1e-8 : tol;

  return locateZeros([], [], f, fp, z0[0], z0[1], r, z0[0], z0[1], r, tol, maxDepth, 0);
}
