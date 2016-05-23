'use strict';

module.exports = smIntegrand;

var cdiv = require('complex-division');

function smIntegrand (out, theta) {
  var c, s, dzr, dzi, a, b, rtmp, itmp;
  out = out || [];

  c = Math.cos(theta);
  s = Math.sin(theta);
  dzr = -this.r * s;
  dzi = this.r * c;
  a = this.z0r + this.r * c;
  b = this.z0i + this.r * s;

  var rtmp, itmp;

  // out <- f(z)
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

  // out /= 2 pi i
  rtmp = out[0];
  out[0] = (out[0] * dzi + out[1] * dzr) * 0.5 / Math.PI;
  out[1] = (-rtmp * dzr + out[1] * dzi) * 0.5 / Math.PI;

  // out *= z
  rtmp = out[0];
  out[0] = out[0] * a - out[1] * b;
  out[1] = rtmp * b + out[1] * a;

  // out[i] = out[i - 1] * z
  for (var i = 2; i < 2 * this.M; i += 2) {
    out[i] = out[i - 2] * a - out[i - 1] * b;
    out[i + 1] = out[i - 2] * b + out[i - 1] * a;
  }
}
