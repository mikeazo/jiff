(function (exports, node) {
  var saved_instance;

  /**
   * Connect to the server and initialize the jiff instance
   */
  exports.connect = function (hostname, computation_id, options) {
    var opt = Object.assign({}, options);

    if (node) {
      // eslint-disable-next-line no-undef
      jiff = require('../../lib/jiff-client');
      jiff_relational = require('../../lib/ext/jiff-client-relational');
      $ = require('jquery-deferred');
    }

    // eslint-disable-next-line no-undef
    saved_instance = jiff.make_jiff(hostname, computation_id, opt);
    saved_instance.apply_extension(jiff_relational, opt);
    return saved_instance;
  };

  /**
   * Testing relational functions
   */
  exports.test_map_eq = function(arr, jiff_instance) {
    var deferred = $.Deferred();
    var allPromisedResults = [];

    jiff_instance.share_array(arr, arr.length).then( function(shares) {
        var result = jiff_instance.helpers.map(shares[1], function(s) { return s.eq(s); });
 
        // process array of outputs
        for(var i = 0; i<result.length; i++){
          allPromisedResults.push(jiff_instance.open(result[i]));
        }

        Promise.all(allPromisedResults).then(function (results) {
            deferred.resolve(results);
        });
    });
    return deferred.promise();;
  }

  exports.test_map_square = function(arr, jiff_instance) {
    var deferred = $.Deferred();
    var allPromisedResults = [];

    jiff_instance.share_array(arr, arr.length).then( function(shares) {
        var sums = shares[1];
        for (var i=0; i<sums.length; i++) {
          for (var p=2; p<jiff_instance.party_count; p++) {
            sums[i] = sums[i].sadd( shares[p][i] );
          }
        }
        var result = jiff_instance.helpers.map(sums, function(s) { return s.smult(s); });
 
        // process array of outputs
        for(var i = 0; i<result.length; i++){
          allPromisedResults.push(jiff_instance.open(result[i]));
        }

        Promise.all(allPromisedResults).then(function (results) {
            deferred.resolve(results);
        });
    });
    return deferred.promise();;

  }
}((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));
