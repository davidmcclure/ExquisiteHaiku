/*
 * Use require in Jasmine tests. Slightly adapted from
 * https://github.com/scottburch/jasmine-require.
 */

function requireDependencies(deps, cb) {
  deps = Array.isArray(deps) ? deps : [deps];
  beforeEach(function () {
    var done = false;
    runs(function () {
      require(deps, function () {
        cb && cb.apply(cb, arguments);
        done = true;
      });
    });
    waitsFor(function () {
      return done;
    });
  });
}
