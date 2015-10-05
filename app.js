var Hapi = require('hapi');
var inspect = require('util').inspect;
var query = require('./query'); //contains all queries
var logger = require('./config/logging.js');
var https = require('https');
var bcrypt = require('bcrypt');
var fs = require('fs');
var uuid = require('node-uuid');

var server = new Hapi.Server();
server.connection({ port: 3000,
                    tls: {
                      key: fs.readFileSync('./config/mariadb-backend-server-key.pem'),
                      cert: fs.readFileSync('./config/mariadb-backend-server-cert.pem')
                    }
});

function replyResult(err, result, code, reply){
  if (err){
    logger.error(err);
    reply({'err':err}).code(code);
    return;
  }
  reply(result).code(code);
}

server.route([
  {
    path: '/{id}/zeiterfassung',
    method: 'GET',
    config: {
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
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/kunden',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query kunden
        var parameters = {};
        query.queryMaria(query.customersQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/kunde',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query kunde
        var parameters = {name: req.query.name};
        query.queryMaria(query.customerQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query mitarbeiter
        var parameters = {};
        query.queryMaria(query.employeesQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/login',
    method: 'Post',
    config: {
      handler: function(req, reply) {
        // Query login
        // console.log(req.payload);
        query.queryMaria(query.hashQuery, req.payload, function(err, hashResult){
          var code = 400; // OK
          if(hashResult[0]){
            // Verify login
            bcrypt.compare(req.payload.password, hashResult[0].Hash, function(err, valide) {
              if(valide===true){
                var expireDate = new Date();
                expireDate.setTime( expireDate.getTime() + 1 * 86400000 );
                var parameters ={
                                  user: req.payload.user,
                                  sessionId: uuid.v4(),
                                  expireDate: expireDate.toISOString()
                                };
                query.queryMaria(query.createUpdateSessionId, parameters, function(err, result){
                  if(err){
                    // User and Password ok Error during sessionId creation
                    return replyResult(err,[{ 'valide': true, 'sessionId': '' }],code,reply);
                  }
                  code = 200;
                  // User and Password ok sessionId created
                  return replyResult(err,[{ 'valide': true, 'sessionId': parameters.sessionId }],code,reply);
                });
              } else {
                // Password wrong
                return replyResult(err,[{ 'valide': false, 'sessionId':''}],code,reply);
              }
            });
          }else{
            // User wrong
            return replyResult(err,[{ 'valide': false, 'sessionId':''}],code,reply);
          }
        });
      }
    }
  },
  {
    path: '/{id}/projekte',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query projekte
        var parameters = {};
        query.queryMaria(query.projectsQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/teilprojekte',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query Teilprojekte per project
        var parameters = {name: req.query.name};
        query.queryMaria(query.childProjectsQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/orte',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        // Query Teilprojekte per project
        var parameters = {};
        query.queryMaria(query.placesQuery, parameters, function(err, result){
          // Set HTTP Status Code
          var code = 200; // OK
          if(err){
            code = 400; // Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/api/items/{itemId}',
    method: 'PUT',
    config: {
      handler: function(req, reply) {
        req.item.set(req.body);
        req.item.save(function(err, item) {
          reply(item).code(204);
        });
      }
    }
  },
  {
    path: '/{id}/zeiterfassung',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        // add {id}to parameter as mitarbeiter
        var parameters = req.payload;
        parameters.short =  req.params.id;
        query.queryMaria(query.createTimeEntryQuery, parameters, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/projekte',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.createProjectQuery, req.payload, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/teilprojekte',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.createChildprojectQuery, req.payload, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'POST',
    config: {
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
              replyResult(err,result,code,reply);
            });
          });
        });
      }
    }
  },
  {
    path: '/{id}/kunde',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.createCustomerQuery, req.payload, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/orte',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.createPlaceQuery, req.payload, function(err, result){
          var code = 201;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.deleteEmployeeQuery, req.payload, function(err, result){
          var code = 204;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/projekte',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.deleteProjectQuery, req.payload, function(err, result){
          var code = 204;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/teilprojekte',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.deleteChildprojectQuery, req.payload, function(err, result){
          var code = 204;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/kunde',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.deleteCustomerQuery, req.payload, function(err, result){
          var code = 204;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  },
  {
    path: '/{id}/orte',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        query.queryMaria(query.deletePlaceQuery, req.payload, function(err, result){
          var code = 204;
          if(err){
            code = 400; //Bad Request
          }
          replyResult(err,result,code,reply);
        });
      }
    }
  }
]);

server.register(require('hapi-auth-cookie'), function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'supersecretpassword',
        cookie: 'maria-backend',
        redirectTo: '/login',
        isSecure: false
    });
});

server.start(function () {
  logger.info('Server running at: %s', server.info.uri);
  logger.info(server.info);
});

//used to set log level
module.exports.setLevel = function(level) {
  if (level==='test') {
    logger.remove('info-console');
    logger.remove('info-file');
    logger.remove('error-file');
  };
}

//used to stop the server
module.exports.stopServer = function() {
  server.stop({ timeout: 60 * 1000 }, function (err) {
    logger.info('Server stopped');
  });
}

