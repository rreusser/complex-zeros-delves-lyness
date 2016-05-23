'use strict';

module.exports = delvesLynessRoots;

var integrate = require('integrate-adaptive-simpson');
var cIntegrate = require('integrate-adaptive-simpson/vector');
var s0Integrand = require('./lib/s0-integrand');
var smIntegrand = require('./lib/sm-integrand');
var roots = require('durand-kerner');

function delvesLynessRoots (f, fp, z0, r, tol, maxDepth) {
  tol = tol === undefined ? 1e-8 : tol;
  var i, j, p, M, er, ei, sgn, sgn2, s0, j2;

  z0 = z0 === undefined ? [0, 0] : z0;
  r = r === undefined ? 1 : r;
  maxDepth = maxDepth === undefined ? 20 : maxDepth;

  var params = {z0r: z0[0], z0i: z0[1], r: r, f: f, fp: fp};

  s0 = integrate(s0Integrand.bind(params), 0, Math.PI * 2, Math.sqrt(tol), maxDepth);
  M = Math.round(s0);

  if (M === 0) {
    return [[], []];
  } else if (Math.abs(s0 - M) > 1e-1) {
    return false;
  }

  params.M = M;
  var sm = smIntegrand.bind(params);
  p = cIntegrate(sm, 0, Math.PI * 2, tol, maxDepth);

  // Use Newton's Identities to construct a polynomial, the roots of
  // which match our complex analytic function:
  er = [1, p[0]];
  ei = [0, p[1]];

  for (i = 2, sgn = -1; i <= M; i++, sgn = -sgn) {
    er[i] = p[2 * i - 2] * sgn;
    ei[i] = p[2 * i - 1] * sgn;
    for (j = 1, sgn2 = -sgn; j < i; j++, sgn2 = -sgn2) {
      j2 = 2 * (i - j - 1);
      er[i] += (er[j] * p[j2] - ei[j] * p[j2 + 1]) * sgn2;
      ei[i] += (er[j] * p[j2 + 1] + ei[j] * p[j2]) * sgn2;
    }
    er[i] /= i;
    ei[i] /= i;
  }

  sgn = M % 2 === 0 ? 1 : -1;
  for (i = 0; i <= M; i++, sgn = -sgn) {
    er[i] *= sgn;
    ei[i] *= sgn;
  }
  er.reverse();
  ei.reverse();

  return roots(er, ei, 100 * M * M, tol);
}
