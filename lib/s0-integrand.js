'use strict';

module.exports = s0Integrand;

var cdiv = require('complex-division');

var tmp1 = new Array(2);
var tmp2 = new Array(2);
var r2PI = 0.5 / Math.PI;

function s0Integrand (theta) {
  var c, s, dzr, dzi, a, b;
  c = Math.cos(theta);
  s = Math.sin(theta);
  dzr = -this.r * s;
  dzi = this.r * c;
  a = this.z0r + this.r * c;
  b = this.z0i + this.r * s;

  // tmp2 <- f(z)
  this.f(tmp2, a, b);

  // tmp1 <- f'(z)
  tmp1[0] = tmp2[2];
  if (tmp2[2] === undefined) {
    this.fp(tmp1, a, b);
  } else {
    tmp1[1] = tmp2[3];
  }

  // tmp1 /= tmp2
  cdiv(tmp1[0], tmp1[1], tmp2[0], tmp2[1], tmp1);

  return (tmp1[0] * dzi + tmp1[1] * dzr) * r2PI;
}

