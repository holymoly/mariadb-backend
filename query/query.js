var Client = require('mariasql');
var inspect = require('util').inspect;
var logger = require('../config/logging.js');
var fs = require('fs');

// If config is updated the maria-backend has to restart
var mariadbConfig = JSON.parse(fs.readFileSync('./config/mariadb.json'));

// Selection of the queries needed
// For better readability Strings are appended by the plus sign to keep better readability.
// Javascript is not capable of multiline strings.
// the notation :someName is used to dynamicaly change values on runtime

// Used to get all timeentries based on :name, :startDate, :endDate, :startTime, :endTime
// returns n rows:
// | idTimes | idEmployee | Lastname | Name | idDuration | Begin | End | idCustomer | Customer | idProject | Project | Project Description | idChildproject | Childproject | Childproject Description | idPlace | Place |
var timeEntriesQuery = 'SELECT '+
  '`Times`.`idTimes`, '+
  '`Times`.`Employees_idEmployees` as `idEmployee`, '+
  '`Employees`.`Lastname`, '+
  '`Employees`.`Name`, '+
  '`Times`.`Durations_idDurations` as `idDuration`, '+
  '`Durations`.`Begin`, '+
  '`Durations`.`End`, '+
  '`Projects`.`Customers_idCustomers` as `idCustomer`, '+
  '`Customers`.`Name` as `Customer`, '+
  '`Childprojects`.`Projects_idProjects` as `idProject`, '+
  '`Projects`.`Name`as `Project`, ' +
  '`Projects`.`Description`as `Project Description`, '+
  '`Times`.`Childprojects_idChildprojects` as `idChildproject`, '+
  '`Childprojects`.`Name`as `Childproject`, '+
  '`Childprojects`.`Description`as `Childproject Description`, '+
  '`Times`.`Places_idPlaces` as `idPlace`, '+
  '`Places`.`Name` as `Place` '+
'FROM Times '+
  'INNER JOIN `Employees` ON `Times`.`Employees_idEmployees` = `Employees`.`idEmployees` '+
  'INNER JOIN `Durations` ON `Times`.`Durations_idDurations` = `Durations`.`idDurations` '+
  'INNER JOIN `Places` ON `Times`.`Places_idPlaces` = `Places`.`idPlaces` '+
  'INNER JOIN `Childprojects` ON `Times`.`Childprojects_idChildprojects` = `Childprojects`.`idChildprojects` '+
  'INNER JOIN `Projects` ON `Childprojects`.`Projects_idProjects` = `Projects`.`idProjects` '+
  'INNER JOIN `Customers` ON `Projects`.`Customers_idCustomers` = `Customers`.`idCustomers` '+
'WHERE `Employees`.`Short` = :short '+
  'AND DATE_FORMAT(`Durations`.`Begin`, "%Y-%m-%d") >= :startDate '+
  'AND DATE_FORMAT(`Durations`.`End`, "%Y-%m-%d") <= :endDate '+
  'AND DATE_FORMAT(`Durations`.`Begin`, "%H:%i:%S") > :startTime  '+
  'AND DATE_FORMAT(`Durations`.`End`, "%H:%i:%S") < :endTime ;';

// Used to get all Custommers
// returns n rows:
// | idKunden | Name | create_time |
var customersQuery = 'SELECT * FROM zeiterfassung.Customers;'

// Used to get one Custommer
// returns 1 row:
// | idKunden | Name | create_time |
var customerQuery = 'SELECT * FROM zeiterfassung.Customers WHERE Name=:name;'


// Used to hash based on email
// returns one row:
// | idEmployees | Short | hash | create_time |
// ***********************
// Only use for verification
// ***********************
var hashQuery = 'SELECT '+
    'Employees.idEmployees, '+
    'Employees.Short, '+
    'Employees.Hash, '+
    'Employees.create_time ' +
  'FROM zeiterfassung.Employees '+
  'Where Employees.Short = :user;'

// Used to get all Employees
// returns n rows:
// ***********************
// DO NOT RETURN HASH!!!!!
// ***********************
var employeesQuery = 'SELECT '+
    'Employees.idEmployees, '+
    'Employees.Name, '+
    'Employees.Lastname, '+
    'Employees.Short, '+
    'Employees.Email, '+
    'Employees.Phone, '+
    'Employees.Locked, '+
    'create_time '+
  'FROM zeiterfassung.Employees;'

// Used to get all Places
// returns n rows:
// | idPlaces | Name | Position | create_time |
var placesQuery = 'SELECT * FROM zeiterfassung.Places;'

// Used to get all Projects
// returns n rows:
// | idProjects | Name | Beschreibung | create_time | idkunden | Kunde | Kunden_create_time |
var projectsQuery = 'SELECT '+
    'Projects.idProjects, '+
    'Projects.Name, '+
    'Projects.Description, '+
    'Projects.create_time, '+
    'Projects.Customers_idCustomers as `idCustomer`, '+
    'Customers.Name as Customer, '+
    'Customers.create_time as `Customer create time` '+
  'FROM zeiterfassung.Projects '+
  'INNER JOIN `Customers` ON `Projects`.`Customers_idCustomers` = `Customers`.`idCustomers`;'


// Used to get all child Projects
// returns n rows:
// | idTeilProjects | Name | Beschreibung | create_time | Projects_idProjects | Projects_Name | Projects_Beschreibung | Projects_create_time | Projects_idKunden | Kunden_name | Kunden_create_time |
var childProjectsQuery =  'SELECT '+
    'Childprojects.idChildprojects as idChildproject, '+
    'Childprojects.Name, '+
    'Childprojects.Description, '+
    'Childprojects.create_time, '+
    'Childprojects.Projects_idProjects as `idProject`, '+
    'Projects.Name as `Project Name`, '+
    'Projects.Description as `Project Description`, '+
    'Projects.create_time as `Project create time`, '+
    'Projects.Customers_idCustomers as `Project idCustomer`, '+
    'Customers.Name as `Customer name`, '+
    'Customers.create_time as `Customer create time` '+
  'FROM zeiterfassung.Childprojects '+
  'INNER JOIN `Projects` ON `Childprojects`.`Projects_idProjects` = `Projects`.`idProjects` '+
  'INNER JOIN `Customers` ON `Projects`.`Customers_idCustomers` = `Customers`.`idCustomers` '+
  'WHERE `Childprojects`.`Name` = :name;'

// Insert one Time entry
var createTimeEntryQuery = 'INSERT INTO '+
    'Durations (Begin,End)'+
    'VALUES (:startTime, :endTime); '+
  'INSERT INTO '+
    'Times (Durations_idDurations,Places_idPlaces,Employees_idEmployees,Childprojects_idChildprojects,Work) '+
    'VALUES (LAST_INSERT_ID(),:ort,(SELECT `idEmployees` FROM zeiterfassung.Employees WHERE Short = :short),:teilprojekt,:arbeit);';

// Insert new Employee
var createEmployeeQuery = 'INSERT INTO '+
    'Employees (Name,Lastname,Short,Email,Phone,Locked,Hash) '+
    'VALUES (:name,:lastname,:short,:email,:phone,:locked,:hash); ';

// Create new Project
var createProjectQuery = 'INSERT INTO '+
    'Projects (Name,Description,Customers_idCustomers) '+
    'VALUES (:name,:description,:idCustomer); ';

// Create new Childproject
var createChildprojectQuery = 'INSERT INTO '+
    'Childprojects (Name,Description,Projects_idProjects) '+
    'VALUES (:name,:description,:idProject); ';

// Create new Customer
var createCustomerQuery = 'INSERT INTO '+
    'Customers (Name) '+
    'VALUES (:name); ';

// Create new Place
var createPlaceQuery = 'INSERT INTO '+
    'Places (Name,Position) '+
    'VALUES (:name,point(:x,:y)); ';

// Delete Employee based on short Name
var deleteEmployeeQuery = 'Delete FROM zeiterfassung.Employees WHERE Short=:user;';

// Delete Project based on Name
var deleteProjectQuery = 'Delete FROM zeiterfassung.Projects WHERE Name=:name;';

// Delete Project based on Name
var deleteChildprojectQuery = 'Delete FROM zeiterfassung.`Childprojects` WHERE Name=:name;';

// Delete Customer based on Name
var deleteCustomerQuery = 'Delete FROM zeiterfassung.`Customers` WHERE Name=:name;';

// Delete Place based on Name
var deletePlaceQuery = 'Delete FROM zeiterfassung.`Places` WHERE Name=:name;';

// Asking MariaDB
function queryMaria(queryString,options, cb){
  var c = new Client();
  // Preparing the query
  var pq = c.prepare(queryString);
  //console.log(queryString);
  logger.info(pq(options));
  // Array which will store the rows
  var result = [];
  var qcnt = 0;
  // Executing the query and passing parameters
  c.query(pq(options))
    .on('result', function(res) {
      // Count numbers of results
      logger.info('Result No: ' + ++qcnt);
      res.on('row', function(row) {
        result.push(row);
        logger.info('Result row: ' + inspect(row));
      })
      .on('error', function(err) {
        cb(err,null);
        logger.error('Result error: ' + inspect(err) + '  \r\n on query: ' + pq(options));
      })
      .on('end', function(info) {
        logger.info('Result finished successfully');
      });
    })
    .on('end', function() {
      // ToDo: Check if result was executed, If not nothing was found,inserted
      // updated or deleted
      cb(null, result);
      logger.info('Done with all results');
      c.end();
    });
    // Events the client listens on
    c.on('connect', function() {
        logger.info('Client connected');
      })
      .on('error', function(err) {
        logger.error('Client error: ' + err);
        cb(err,null);
      })
      .on('close', function(hadError) {
        logger.info('Client closed');
      });
    // After event listeners are setup, connect to mariadb
    // mariadbConfig should look like:
    //    {
    //      "host": "127.0.0.1",
    //      "user": "username",
    //      "password": "secret",
    //      "db": "nameOfDb",
    //      "multiStatements": true,
    //      "compress": true
    //    }

    c.connect(mariadbConfig);
};

module.exports.timeEntriesQuery = timeEntriesQuery;
module.exports.createTimeEntryQuery = createTimeEntryQuery;
module.exports.customersQuery = customersQuery;
module.exports.customerQuery = customerQuery;
module.exports.employeesQuery = employeesQuery;
module.exports.projectsQuery = projectsQuery;
module.exports.placesQuery = placesQuery;
module.exports.childProjectsQuery = childProjectsQuery;
module.exports.createEmployeeQuery = createEmployeeQuery;
module.exports.deleteEmployeeQuery = deleteEmployeeQuery;
module.exports.createProjectQuery = createProjectQuery;
module.exports.deleteProjectQuery = deleteProjectQuery;
module.exports.createChildprojectQuery = createChildprojectQuery;
module.exports.deleteChildprojectQuery = deleteChildprojectQuery;
module.exports.createCustomerQuery = createCustomerQuery;
module.exports.deleteCustomerQuery = deleteCustomerQuery;
module.exports.createPlaceQuery = createPlaceQuery;
module.exports.deletePlaceQuery = deletePlaceQuery;
module.exports.hashQuery = hashQuery;

module.exports.queryMaria = queryMaria;
