'use strict';

var assert = require('chai').assert;
var roots = require('../');
var assertContainsRoots = require('./util/assert-contains-roots');
var assertRoots = require('./util/assert-roots');

describe('complex-zeros-delves-lyness', function () {
  context("computing f and f' simultaneously", function () {
    it('returns empty if no roots, e.g. z = 4', function () {
      var f = function (out, a, b) {
        out[0] = 4;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
      };

      var z = roots(f, null, [0, 0], 20);
      assertContainsRoots([[], []], z);
      assertRoots(f, z);
    });

    it('finds the trivial root of z - 7 + 2i', function () {
      var f = function (out, a, b) {
        out[0] = a - 7;
        out[1] = b + 2;
        out[2] = 1;
        out[3] = 0;
      };

      var z = roots(f, null, [0, 0], 20);
      assertContainsRoots([[7], [-2]], z);
      assertRoots(f, z);
    });

    it('finds roots of z * (z - 1) * (z - i)', function () {
      var f = function (out, a, b) {
        out[0] = -3 * a * b * b + b * b + 2 * a * b - b + a * a * a - a * a;
        out[1] = -b * b * b + b * b + 3 * a * a * b - 2 * a * b - a * a + a;
        out[2] = -3 * b * b + 2 * b + 3 * a * a - 2 * a;
        out[3] = 6 * a * b - 2 * b - 2 * a + 1;
      };

      var z = roots(f, null, [0, 0], 5);
      assertContainsRoots([[0, 1, 0], [0, 0, 1]], z);
      assertRoots(f, z);
    });

    it('finds roots of (z + 7) * (z - 12i) * (z - 3)', function () {
      var f = function (out, a, b) {
        out[0] = -3 * a * b * b - 4 * b * b + 24 * a * b + 48 * b + a * a * a + 4 * a * a - 21 * a;
        out[1] = -b * b * b + 12 * b * b + 3 * a * a * b + 8 * a * b - 21 * b - 12 * a * a - 48 * a + 252;
        out[2] = -3 * b * b + 24 * b + 3 * a * a + 8 * a - 21;
        out[3] = 6 * a * b + 8 * b - 24 * a - 48;
      };

      var z = roots(f, null, [0, 0], 20);
      assertContainsRoots([[-7, 0, 3], [0, 12, 0]], z);
      assertRoots(f, z);
    });

    it('finds roots of (z + 7 - 6i) * (z + 4 - 12i) * (z - 3 + 2i)', function () {
      var f = function (out, a, b) {
        out[0] = -3 * a * b * b - 8 * b * b + 32 * a * b + 32 * b + a * a * a + 8 * a * a - 41 * a + 348;
        out[1] = -b * b * b + 16 * b * b + 3 * a * a * b + 16 * a * b - 41 * b - 16 * a * a - 32 * a + 236;
        out[2] = -3 * b * b + 32 * b + 3 * a * a + 16 * a - 41;
        out[3] = 6 * a * b + 16 * b - 32 * a - 32;
      };

      var z = roots(f, null, [0, 0], 20);
      assertContainsRoots([[-7, -4, 3], [6, 12, -2]], z);
      assertRoots(f, z);
    });

    it('deflates zeros and finds roots of cos(z) + sin(z)', function () {
      var f = function (out, a, b) {
        var chb = Math.cosh(b);
        var shb = Math.sinh(b);
        var ca = Math.cos(a);
        var sa = Math.sin(a);
        out[0] = chb * (ca + sa);
        out[1] = shb * (ca - sa);
        out[2] = chb * (ca - sa);
        out[3] = -shb * (ca + sa);
      };

      var z = roots(f, null, [0, 0], 10, 1e-4, 20);
      assert.equal(z[0].length, 6);
      assertRoots(f, z);
    });
  });
});
