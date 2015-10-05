var Hapi = require('hapi');
var inspect = require('util').inspect;
var query = require('./query'); //contains all queries
var logger = require('./config/logging.js');
var https = require('https');
var bcrypt = require('bcrypt');
var fs = require('fs');
var uuid = require('node-uuid');

var server = new Hapi.Server();
server.connection({
  port: 3000,
  tls:
  {
    key: fs.readFileSync('./config/mariadb-backend-server-key.pem'),
    cert: fs.readFileSync('./config/mariadb-backend-server-cert.pem')
  }
});

// Setup cookie based authentication
server.register(require('hapi-auth-cookie'), function (err){
  server.auth.strategy('session', 'cookie',{
    password: 'secret',
    cookie: 'maria-backend',
    redirectTo: '/login',
    isSecure: true
  })
});

// Reply for every route
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
                  code = 200;
                  // User and Password ok sessionId created
                  req.auth.session.set({ id: req.payload.user });
                  return replyResult(err,[{ 'valide': true }],code,reply);
              } else {
                // Password wrong
                return replyResult(err,[{ 'valide': false }],code,reply);
              }
            });
          }else{
            // User wrong
            return replyResult(err,[{ 'valide': false }],code,reply);
          }
        });
      },
      plugins: {
        'hapi-auth-cookie': {redirectTo: false}
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
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
      },
      auth: 'session'
    }
  }
]);

// Start server ;)
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

