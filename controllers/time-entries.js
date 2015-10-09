var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

module.exports.getTimeEntries = {
  handler: function(req, reply) {
    //Query zeiterfassung
    var parameters = { short: req.params.id,
                       startDate: req.query.startDate,
                       endDate: req.query.endDate,
                       startTime: req.query.startTime,
                       endTime: req.query.endTime };
    query.queryMaria(query.timeEntriesQuery, parameters, function(err, result){
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

module.exports.postTimeEntry = {
  handler: function(req, reply) {
    // add {id}to parameter as mitarbeiter
    var parameters = req.payload;
    parameters.short =  req.params.id;
    query.queryMaria(query.createTimeEntryQuery, parameters, function(err, result){
      var code = 201;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.updateTimeEntry = {
  handler: function(req, reply) {
    // add {id}to parameter as mitarbeiter
    var parameters = req.payload;
    parameters.short =  req.params.id;
    query.queryMaria(query.updateTimeEntryQuery, parameters, function(err, result){
      var code = 200;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}

module.exports.deleteTimeEntry = {
  handler: function(req, reply) {
    query.queryMaria(query.deleteTimeEntry, req.payload, function(err, result){
      var code = 204;
      if(err){
        code = 400; //Bad Request
      }
      replyResult.replyResult(err,result,code,reply);
    });
  },
  auth: 'session'
}
