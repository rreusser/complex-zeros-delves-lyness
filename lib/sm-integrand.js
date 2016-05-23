'use strict';

module.exports = smIntegrand;

var cdiv = require('complex-division');

var tmp = new Array(2);
var r2PI = 0.5 / Math.PI;

function smIntegrand (out, theta) {
  var tmp2, c, s, dzr, dzi, a, b;
  out = out || [];

  c = Math.cos(theta);
  s = Math.sin(theta);
  dzr = -this.r * s;
  dzi = this.r * c;
  a = this.z0r + this.r * c;
  b = this.z0i + this.r * s;

  // tmp <- f(z)
  this.f(tmp, a, b);

  // out <- f'(z)
  if (tmp[2] === undefined) {
    this.fp(out, a, b);
  } else {
    out[0] = tmp[2];
    out[1] = tmp[3];
  }

  // out /= tmp
  cdiv(out[0], out[1], tmp[0], tmp[1], out);

  // out /= 2 pi i
  tmp2 = out[0];
  out[0] = (out[0] * dzi + out[1] * dzr) * r2PI;
  out[1] = (-tmp2 * dzr + out[1] * dzi) * r2PI;

  // out *= z
  tmp2 = out[0];
  out[0] = out[0] * a - out[1] * b;
  out[1] = tmp2 * b + out[1] * a;

  // out[i] = out[i - 1] * z
  for (var i = 2; i < 2 * this.M; i += 2) {
    out[i] = out[i - 2] * a - out[i - 1] * b;
    out[i + 1] = out[i - 2] * b + out[i - 1] * a;
  }
}
