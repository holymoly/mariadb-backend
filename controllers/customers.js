var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

module.exports.getCustomers = {
  handler: function(req, reply) {
    // Query kunden
    var parameters = {};
    query.queryMaria(query.customersQuery, parameters, function(err, result){
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

module.exports.getCustomer = {
  handler: function(req, reply) {
    // Query kunde
    var parameters = {name: req.query.name};
    query.queryMaria(query.customerQuery, parameters, function(err, result){
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

module.exports.postCustomer = {
  handler: function(req, reply) {
    query.queryMaria(query.createCustomerQuery, req.payload, function(err, result){
      var code = 201;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.updateCustomer = {
  handler: function(req, reply) {
    query.queryMaria(query.updateCustomerQuery, req.payload, function(err, result){
      var code = 200;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.deleteCustomer = {
  handler: function(req, reply) {
    query.queryMaria(query.deleteCustomerQuery, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
