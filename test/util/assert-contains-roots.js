'use strict';

module.exports = assertContainsRoots;

var almostEqual = require('almost-equal');

function assertContainsRoots (e, c, tol) {
  tol = tol === undefined ? almostEqual.FLT_EPSILON : tol;

  if (!e.length && !c.length) {
    return;
  }

  if (e[0].length !== c[0].length) {
    throw new Error('Expected ' + e[0].length + ' roots, got ' + c[0].length);
  }
  var n = e[0].length;

  for (var i = 0; i < n; i++) {
    var found = false;
    for (var j = 0; j < n; j++) {
      if (almostEqual(e[0][i], c[0][j], tol, tol) && almostEqual(e[1][i], c[1][j], tol, tol)) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error('Failed to find root matching ' + e[0][i] + ' + ' + e[1][i] + 'i');
    }
  }
}

