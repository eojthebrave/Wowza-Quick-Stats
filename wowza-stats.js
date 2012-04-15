#!/usr/bin/env node

// Requires.
// request, jsdom, optimist, all of which can be install with npm.

// NOTE: -----------------------------------------------------------------------
// Uses jsdom 0.2.13, 0.2.14 has a bug
// https://github.com/tmpvar/jsdom/issues/436
// Install w/ npm via `npm install jsdom@0.2.13`
// -----------------------------------------------------------------------------

// Require modules.
var request = require('request'),
    jsdom = require('jsdom'),
    argv = require('optimist').argv;

// Make sure that at least the --uri argument was passed.
if (argv.uri.length == 0) {
  console.log('URI Required! Script should be called with one argument which is the URI of the connectioncounts HTTP provider to query.');
  return;
}

/**
 *
 */
var Collector = {
  stats: {},
  get_stats: function(uri, callback) {
    request({ uri: uri }, function (error, response, body) {
      if (error && response.statusCode !== 200) {
        console.log('Error when contacting ' + uri);
      }

      jsdom.env({
        html: body,
        scripts: [
          // TODO:
          // Does this end up making a network call for every time this code
          // gets fired or does jsdom load it once and use it over and over?
          'http://code.jquery.com/jquery.min.js'
        ]
      }, function (err, window) {
        // User jQuery to Gather some stats from the connectioncounts HTTP
        // provider.
        var $ = window.jQuery;
        Collector.stats['connections_current'] = parseInt($('ConnectionsCurrent').html());
        Collector.stats['connections_total'] = parseInt($('ConnectionsTotal').html());
        Collector.stats['bytes_in'] = parseFloat($('MessagesInBytesRate').html());
        Collector.stats['bytes_out'] = parseFloat($('MessagesOutBytesRate').html());
        callback(window);
      });
    });
  },
 }

/**
 * Wrap Collector.get_stats call in a closure it works better with setInterval.
 */
var callDelay = function() {
  Collector.get_stats(argv.uri, function(response) {
    // Print out collected stats.
    console.log(Collector.stats);
    // Show the names of all streams being viewed.
    //response.jQuery('ApplicationInstance Stream Name').each(function(index, value) {
    //  console.log(response.jQuery(value).html().replace('%2F', '/'));
    //});
  });
}

// Get stats once right away.
callDelay();

// Allo repeating at specified interval if --repeat is set.
if (argv.repeat != undefined) {
  // Default to every 30 seconds if no delay is specified.
  if (argv.delay == undefined) {
    argv.delay = 30000;
  }
  setInterval(callDelay, argv.delay);
}
