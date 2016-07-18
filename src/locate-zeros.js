'use strict';

module.exports = locateZeros;

var integrate = require('integrate-adaptive-simpson');
var vecIntegrate = require('integrate-adaptive-simpson/vector');
var s0Integrand = require('./s0-integrand');
var smIntegrand = require('./sm-integrand');
var roots = require('durand-kerner');
var newtonIds = require('./newtons-identities');
var cmod = require('complex-modulus');

// A global to this file so we don't have to rebind functions every time:
var params = {};

s0Integrand = s0Integrand.bind(params)
smIntegrand = smIntegrand.bind(params)

var dzrsub = [
  0, 0.81, 0.5727564927611035, 0, -0.5727564927611035,
  -0.81, -0.5727564927611035, 0, 0.5727564927611035
];

var dzisub = [
  0, 0, 0.5727564927611035, 0.81, 0.5727564927611035, 0,
  -0.5727564927611035, -0.81, -0.5727564927611035
];

var rsub = [
  0.5, 0.4166666666666667, 0.4166666666666667, 0.4166666666666667,
  0.4166666666666667, 0.4166666666666667, 0.4166666666666667,
  0.4166666666666667, 0.4166666666666667
];


function locateZeros (qr, qi, f, fp, zr, zi, r, z0r, z0i, r0, tol, maxDepth, curDepth) {
  var p, s0, er, ei, i, j, qri, qii, qmod, qC, M, rr;
  var qNr, qNi, tmp, qNew, success;

  // Bail if we've reached the recursion limit:
  if (curDepth > maxDepth) {
    return false;
  }

  params.z0r = zr;
  params.z0i = zi;
  params.r = r;
  params.f = f;
  params.fp = fp;

  s0 = integrate(s0Integrand, 0, Math.PI * 2, Math.sqrt(tol), maxDepth);
  M = Math.round(s0);

  qC = 0;
  for (i = qr.length - 1; i >= 0; i--) {
    // Count this zero if it's inside the circle:
    qmod = cmod(qr[i] - zr, qi[i] - zi);
    if (qmod < r) qC++;
  }

  if (Math.abs(s0 - M) > 0.1) {
    // If this happens, then we had a pretty inaccurate integration:
  } else if (M - qC <= 0) {
    // If this is the case, then there are no additional zeros to be found:
  } else if (M - qC > 5) {
    // Too many zeros in this circle; subdivide:
    for (i = 0, success = true; i < 9; i++) {
      rr = r * rsub[i];
      success = locateZeros(qr, qi, f, fp,
        zr + r * dzrsub[i],
        zi + r * dzisub[i],
        rr, z0r, z0i, r0, tol, maxDepth, curDepth + 1
      ) && success;
    }
  } else {
    // Compute the zeros:
    params.M = M - qC;
    p = vecIntegrate(smIntegrand, 0, Math.PI * 2, tol, maxDepth);

    // Deflate the result by known zeros inside the current circle:
    for (i = qr.length - 1; i >= 0; i--) {
      qri = qr[i];
      qii = qi[i];

      if (cmod(qri - zr, qii - zi) < r) {
        // The first subtraction is super easy:
        p[0]--;

        for (j = 2, qNr = 1, qNi = 0; j < p.length; j += 2) {
          tmp = qNr;
          qNr = tmp * qri - qNi * qii;
          qNi = tmp * qii + qNi * qri;

          // Subtract off the power of the zero:
          p[j] -= qNr;
          p[j + 1] -= qNi;
        }
      }
    }

    // Apply Newton's Identities, constructing a polynomial sharing the roots
    // of the analytic function:
    er = [];
    ei = [];
    newtonIds(er, ei, params.M, p);

    // Compute the roots of the constructed polynomial:
    qNew = roots(er, ei, 100 * params.M * params.M, tol);

    // Append and filter to zeros inside the original contour:
    for (i = qNew[0].length - 1; i >= 0; i--) {
      if (cmod(qNew[0][i] - z0r, qNew[1][i] - z0i) < r0) {
        qr.push(qNew[0][i]);
        qi.push(qNew[1][i]);
      }
    }
  }

  return [qr, qi];
}
