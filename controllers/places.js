var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

 module.exports.getPlaces = {
  handler: function(req, reply) {
    // Query Teilprojekte per project
    var parameters = {};
    query.queryMaria(query.placesQuery, parameters, function(err, result){
      // Set HTTP Status Code
      var code = 200; // OK
      if(err){
        code = 400; // Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.postPlace = {
  handler: function(req, reply) {
    query.queryMaria(query.createPlaceQuery, req.payload, function(err, result){
      var code = 201;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.deletePlace = {
  handler: function(req, reply) {
    query.queryMaria(query.deletePlaceQuery, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
