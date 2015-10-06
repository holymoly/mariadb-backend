var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

var bcrypt = require('bcrypt');

module.exports.getEmployees = {
  handler: function(req, reply) {
    // Query mitarbeiter
    var parameters = {};
    query.queryMaria(query.employeesQuery, parameters, function(err, result){
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

module.exports.postEmployees = {
  handler: function(req, reply) {
    var parameters = req.payload;
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.payload.password, salt, function(err, hash) {
        parameters.hash = hash;
        // Store hash in your password DB.
        query.queryMaria(query.createEmployeeQuery, parameters, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult.replyResult(err,result,code,reply);
        });
      });
    });
  } /*, ToDo: excluded for test reason
  auth: 'session'
  */
}

module.exports.deleteEmployee = {
  handler: function(req, reply) {
    query.queryMaria(query.deleteEmployeeQuery, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
