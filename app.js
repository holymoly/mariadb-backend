var Hapi = require('hapi');
var inspect = require('util').inspect;
var query = require('./query'); //contains all queries
var logger = require('./config/logging.js');
var https = require('https');
var fs = require('fs');
var bcrypt = require('bcrypt');

// Controllers: handling routes logic
var Login = require('./controllers/login');
var Employees = require('./controllers/employees');
var Projects = require('./controllers/projects');
var TimeEntries = require('./controllers/time-entries');
var Customers = require('./controllers/customers');
var ChildProjects = require('./controllers/child-projects');
var Places = require('./controllers/places');

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

server.route([
  {
    path: '/{id}/zeiterfassung',
    method: 'GET',
    config: TimeEntries.getTimeEntries
  },
  {
    path: '/{id}/kunden',
    method: 'GET',
    config: Customers.getCustomers
  },
  {
    path: '/{id}/kunde',
    method: 'GET',
    config: Customers.getCustomer
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'GET',
    config: Employees.getEmployees
  },
  {
    path: '/login',
    method: 'Post',
    config: Login.login
  },
  {
    path: '/{id}/projekte',
    method: 'GET',
    config: Projects.getProjects
  },
  {
    path: '/{id}/teilprojekte',
    method: 'GET',
    config: ChildProjects.getChildProjects
  },
  {
    path: '/{id}/orte',
    method: 'GET',
    config: Places.getPlaces
  },
  {
    path: '/{id}/zeiterfassung',
    method: 'POST',
    config: TimeEntries.postTimeEntry
  },
  {
    path: '/{id}/projekte',
    method: 'POST',
    config: Projects.postProject
  },
  {
    path: '/{id}/teilprojekte',
    method: 'POST',
    config: ChildProjects.postChildProject
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'POST',
    config: Employees.postEmployees
  },
  {
    path: '/{id}/kunde',
    method: 'POST',
    config: Customers.postCustomer
  },
  {
    path: '/{id}/orte',
    method: 'POST',
    config: Places.postPlace
  },
  {
    path: '/{id}/mitarbeiter',
    method: 'DELETE',
    config: Employees.deleteEmployee
  },
  {
    path: '/{id}/projekte',
    method: 'DELETE',
    config: Projects.deleteProject
  },
  {
    path: '/{id}/teilprojekte',
    method: 'DELETE',
    config: ChildProjects.deleteChildProject
  },
  {
    path: '/{id}/kunde',
    method: 'DELETE',
    config: Customers.deleteCustomer
  },
  {
    path: '/{id}/orte',
    method: 'DELETE',
    config: Places.deletePlace
  }
]);

// Start server ;)
server.start(function () {
  logger.info('Server running at: %s', server.info.uri);
  logger.info(server.info);
});

// used to set log level
module.exports.setLevel = function(level) {
  if (level==='test') {
    logger.remove('info-console');
    logger.remove('info-file');
    logger.remove('error-file');
  };
}

// used to stop the server
module.exports.stopServer = function() {
  server.stop({ timeout: 60 * 1000 }, function (err) {
    logger.info('Server stopped');
  });
}

