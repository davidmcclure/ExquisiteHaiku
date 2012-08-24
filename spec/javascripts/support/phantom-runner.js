var system = require('system');

/**
 * Poll for a condition on the page.
 *
 * @param {Function} testFx: Condition that evaluates to a boolean
 * @param {Function} onReady: Runs when condition is fulfilled.
 * @param {Number} timeOut: Max timeout in miliseconds.
 */
function waitFor(testFx, onReady, timeOut) {

  // Starting parameters.
  var maxWait = timeOut ? timeOut : 3000;
  var start = Date.now();
  var condition = false;

  // Set the interval.
  var interval = setInterval(function() {

    // If maxWait has not elapsed.
    if (Date.now() - start < maxWait && !condition) {
      condition = testFx();
    }

    else {

      // If condition is still false.
      if (!condition) {
        console.log('waitFor() timeout');
        phantom.exit();
      }

      else {
        onReady();
        clearInterval(interval);
      }

    }

  }, 100);

}

if (system.args.length !== 2) {
  console.log('Usage: phantom-runner.js {URL}');
  phantom.exit(1);
}

var page = require('webpage').create();

// Pipe page console logs to terminal.
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

// Run the suite.
page.open(system.args[1], function(status) {

  if (status !== 'success') {
    console.log('Unable to open tests.');
    phantom.exit();
  }

  else {

    console.log('Running Jasmine suite:');
    waitFor(function() {
      return page.evaluate(function() {
        if ($('.passingAlert') || $('.failingAlert'))
          return true;
        return false;
      });
    }, function() {
      page.evaluate(function() {

        // Build dots.
        var symbols = '';
        $('ul.symbolSummary li').each(function(i, li) {
          if ($(li).hasClass('passed')) symbols+='.';
          else if ($(li).hasClass('failed')) symbols+='x';
        });
        console.log(symbols);

        // If passing.
        var passingAlert = $('.passingAlert');
        if (passingAlert.length) {
          console.log(passingAlert.text());
        }

        // Failing.
        else {
          console.log($('.failingAlert').text());
        }

      });
      phantom.exit();
    }, 3000);

  }

});
