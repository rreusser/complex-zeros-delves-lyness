'use strict';

module.exports = newtonsIdentities;

function newtonsIdentities (er, ei, M, p) {
  var i, j, j2, sgn, sgn2;
  // Use Newton's Identities to construct a polynomial, the roots of
  // which match our complex analytic function:
  er[0] = 1;
  ei[0] = 0;
  er[1] = p[0];
  ei[1] = p[1];

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
}
