var Hapi = require('hapi');
var inspect = require('util').inspect;
var query = require('./query'); //contains all queries
var logger = require('./config/logging.js');
var https = require('https');
var fs = require('fs');

var server = new Hapi.Server();
server.connection({ port: 3000,
                    tls: {
                      key: fs.readFileSync('./config/mariadb-backend-server-key.pem'),
                      cert: fs.readFileSync('./config/mariadb-backend-server-cert.pem')
                    }
});
/*
var options = {
  tls: {
    key: fs.readFileSync('./config/mariadb-backend-server-key.pem'),
    cert: fs.readFileSync('./config/mariadb-backend-server-cert.pem')
  }
};
*/

function replyResult(err, result, code, reply){
  if (err){
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
        query.queryMaria(query.createEmployeeQuery, req.payload, function(err, result){
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

