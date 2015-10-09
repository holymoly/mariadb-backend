var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

module.exports.getChildProjects = {
  handler: function(req, reply) {
    // Query Teilprojekte per project
    var parameters = {name: req.query.name};
    query.queryMaria(query.childProjectsQuery, parameters, function(err, result){
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

module.exports.postChildProject = {
  handler: function(req, reply) {
    query.queryMaria(query.createChildprojectQuery, req.payload, function(err, result){
      var code = 201;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.updateChildProject = {
  handler: function(req, reply) {
    query.queryMaria(query.updateChildprojectQuery, req.payload, function(err, result){
      var code = 200;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.deleteChildProject = {
  handler: function(req, reply) {
    query.queryMaria(query.deleteChildprojectQuery, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
