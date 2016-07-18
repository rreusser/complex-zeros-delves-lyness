'use strict';

module.exports = smIntegrand;

var cdiv = require('complex-division');

function smIntegrand (out, theta) {
  var c, s, a, b, rtmp, itmp;

  c = Math.cos(theta) * this.r;
  s = Math.sin(theta) * this.r;
  a = this.z0r + c;
  b = this.z0i + s;

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
  out[0] = (out[0] * c - out[1] * s) * 0.5 / Math.PI;
  out[1] = (rtmp * s + out[1] * c) * 0.5 / Math.PI;

  // out *= z
  rtmp = out[0];
  out[0] = out[0] * a - out[1] * b;
  out[1] = rtmp * b + out[1] * a;

  // Recursively multiply by z to compute successive moments z^N:
  //   out[i] = out[i - 1] * z
  for (var i = 2; i < 2 * this.M; i += 2) {
    out[i] = out[i - 2] * a - out[i - 1] * b;
    out[i + 1] = out[i - 2] * b + out[i - 1] * a;
  }
}
