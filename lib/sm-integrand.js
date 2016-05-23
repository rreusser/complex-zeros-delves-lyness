'use strict';

module.exports = smIntegrand;

var cdiv = require('complex-division');
var hypot = require('math-hypot');

var tmp = new Array(2);
var r2PI = 0.5 / Math.PI;

function smIntegrand (out, theta) {
  var tmp2, c, s, dzr, dzi, a, b, mod, arg;
  out = out || [];

  c = Math.cos(theta);
  s = Math.sin(theta);
  dzr = -this.r * s;
  dzi = this.r * c;
  a = this.a + this.r * c;
  b = this.b + this.r * s;

  // out <- z^m
  mod = Math.pow(hypot(a, b), this.m);
  arg = Math.atan2(b, a) * this.m;
  out[0] = mod * Math.cos(arg);
  out[1] = mod * Math.sin(arg);

  // tmp <- f(z)
  this.f(tmp, a, b);

  // out /= tmp
  cdiv(out[0], out[1], tmp[0], tmp[1], out);

  // tmp <- f'(z)
  tmp[0] = tmp[2];
  if (tmp[2] === undefined) {
    this.fp(tmp, a, b);
  } else {
    tmp[1] = tmp[3];
  }

  // out *= tmp
  tmp2 = out[0];
  out[0] = out[0] * tmp[0] - out[1] * tmp[1];
  out[1] = tmp2 * tmp[1] + out[1] * tmp[0];

  tmp2 = out[0];
  out[0] = (out[0] * dzi + out[1] * dzr) * r2PI;
  out[1] = (-tmp2 * dzr + out[1] * dzi) * r2PI;
}
