'use strict';

var assert = require('chai').assert;
var roots = require('../');
var assertContainsRoots = require('./util/assert-contains-roots');
var assertRoots = require('./util/assert-roots');

describe('delves-lyness-roots', function () {
  context("computing f and f' separately", function () {
    it('finds roots of z * (z - 1) * (z - i)', function () {
      // Roots are: 0, 1, i

      var f = function (out, a, b) {
        out[0] = -3 * a * b * b + b * b + 2 * a * b - b + a * a * a - a * a;
        out[1] = -b * b * b + b * b + 3 * a * a * b - 2 * a * b - a * a + a;
      };

      var fp = function (out, a, b) {
        out[0] = -3 * b * b + 2 * b + 3 * a * a - 2 * a;
        out[1] = 6 * a * b - 2 * b - 2 * a + 1;
      };

      var z = roots(f, fp, [0, 0], 5);
      assertContainsRoots([[0, 1, 0], [0, 0, 1]], z);
      assertRoots(f, z);
    });

    it('finds roots of (z + 7) * (z - 12i) * (z - 3)', function () {
      var f = function (out, a, b) {
        out[0] = -3 * a * b * b - 4 * b * b + 24 * a * b + 48 * b + a * a * a + 4 * a * a - 21 * a;
        out[1] = -b * b * b + 12 * b * b + 3 * a * a * b + 8 * a * b - 21 * b - 12 * a * a - 48 * a + 252;
      };

      // Roots are: -7, 12i, 3

      var fp = function (out, a, b) {
        out[0] = -3 * b * b + 24 * b + 3 * a * a + 8 * a - 21;
        out[1] = 6 * a * b + 8 * b - 24 * a - 48;
      };

      var z = roots(f, fp, [0, 0], 20);
      assertContainsRoots([[-7, 0, 3], [0, 12, 0]], z);
      assertRoots(f, z);
    });

    it('finds roots of (z + 7 - 6i) * (z + 4 - 12i) * (z - 3 + 2i)', function () {
      var f = function (out, a, b) {
        var b2 = b * b;
        var b3 = b2 * b;
        var a2 = a * a;
        var a3 = a2 * a;
        out[0] = -3 * a * b2 - 8 * b2 + 32 * a * b + 32 * b + a3 + 8 * a2 - 41 * a + 348;
        out[1] = -b3 + 16 * b2 + 3 * a2 * b + 16 * a * b - 41 * b - 16 * a2 - 32 * a + 236;
      };

      // Roots are: -7, 12i, 3

      var fp = function (out, a, b) {
        var b2 = b * b;
        var a2 = a * a;
        out[0] = -3 * b2 + 32 * b + 3 * a2 + 16 * a - 41;
        out[1] = 6 * a * b + 16 * b - 32 * a - 32;
      };

      var z = roots(f, fp, [0, 0], 20);
      assertContainsRoots([[-7, -4, 3], [6, 12, -2]], z);
      assertRoots(f, z);
    });

    it('finds roots of cos(z) + sin(z)', function () {
      var f = function (out, a, b) {
        out[0] = Math.cosh(b) * (Math.cos(a) + Math.sin(a));
        out[1] = Math.sinh(b) * (Math.cos(a) - Math.sin(a));
      };

      var fp = function (out, a, b) {
        out[0] = Math.cosh(b) * (Math.cos(a) - Math.sin(a));
        out[1] = -Math.sinh(b) * (Math.cos(a) + Math.sin(a));
      };

      var z = roots(f, fp, [0, 0], 10, 1e-4, 20);
      assert.equal(z[0].length, 6);
      assertRoots(f, z, 1e-5);
    });
  });
});
