var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

module.exports.getProjects = {
  handler: function(req, reply) {
    // Query projekte
    var parameters = {};
    query.queryMaria(query.projectsQuery, parameters, function(err, result){
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

module.exports.postProject = {
  handler: function(req, reply) {
    query.queryMaria(query.createProjectQuery, req.payload, function(err, result){
      var code = 201;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.updateProject = {
  handler: function(req, reply) {
    query.queryMaria(query.updateProjectQuery, req.payload, function(err, result){
      var code = 200;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.deleteProject = {
  handler: function(req, reply) {
    query.queryMaria(query.deleteProjectQuery, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
