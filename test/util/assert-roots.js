'use strict';

var cmod = require('complex-modulus');

module.exports = assertRoots;

function assertRoots (f, z, tol) {
  if (z.length === 0) {
    return;
  }

  for (var i = 0; i < z[0].length; i++) {
    var fi = [];
    f(fi, z[0][i], z[1][i]);
    if (cmod(fi[0], fi[1]) > tol) {
      throw new Error('Expected f(' + z[0][i] + ' + ' + z[1][i] + 'i) to equal zero. Got ' + fi[0] + ' + ' + fi[1] + 'i');
    }
  }
}
