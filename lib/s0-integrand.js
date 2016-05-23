'use strict';

module.exports = s0Integrand;

var cdiv = require('complex-division');
var out = new Array(2);

function s0Integrand (theta) {
  var c, s, a, b, rtmp, itmp;

  c = Math.cos(theta) * this.r;
  s = Math.sin(theta) * this.r;
  a = this.z0r + c;
  b = this.z0i + s;

  // tmp <- f(z)
  this.f(out, a, b);
  rtmp = out[0];
  itmp = out[1];

  // out <- f'(z)
  if (out[2] === undefined) {
    this.fp(out, a, b);
  } else {
    out[0] = out[2];
    out[1] = out[3];
  }

  // out /= tmp
  cdiv(out[0], out[1], rtmp, itmp, out);

  // re(tmp * dz / (2 pi i))
  return (out[0] * c - out[1] * s) * 0.5 / Math.PI;
}

