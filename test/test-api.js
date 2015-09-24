var vows = require('vows');
var app = require('../app.js').setLevel('test');
var assert = require('assert');
var request = require('request');

vows.describe('ApiCheck').addBatch({
  'Post Employee short TST http://127.0.0.1:3000/tst/mitarbeiter': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/mitarbeiter',json: {     name:     'tst',
                                                                            lastname: 'Mustermann',
                                                                            short:    'TST',
                                                                            email:    'dickeLiebhaber84@yahoo.com',
                                                                            phone:    '0815',
                                                                            locked:   '0' }}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Post Project http://127.0.0.1:3000/tst/projekte': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/projekte',json: {  name: 'Project1',
                                                                      description: 'Project1 description',
                                                                      idCustomer: '2'}}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Post Childproject http://127.0.0.1:3000/tst/teilprojekte': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/teilprojekte',json: { name: 'Childproject1',
                                                                            description: 'Childproject1 description',
                                                                            idProject: '5'}}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Post Customer http://127.0.0.1:3000/tst/kunde': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/kunde',json: {  name: 'Customer1'}}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Post Orte http://127.0.0.1:3000/tst/orte': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/orte',json: {  name: 'Place1',
                                                                      x: 12,
                                                                      y: 5 }}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Post Time http://127.0.0.1:3000/tst/zeiterfassung': {
    topic: function(){
      request.post({url:'http://127.0.0.1:3000/tst/zeiterfassung',json: {startTime:  '2015-09-01 08:00:00',
                                                                      endTime:    '2015-09-01 010:00:00',
                                                                      ort:        '2',
                                                                      teilprojekt:'2',
                                                                      arbeit:     'Hab was geschafft'}}, this.callback)
    },
    'should respond with 201': function (err, res, body) {
      assert.equal(res.statusCode, 201); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  }
}).addBatch({
  'Get Employees http://127.0.0.1:3000/tst/mitarbeiter': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/mitarbeiter'}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idEmployees,Name,Lastname,Short,Email,Phone,Locked,create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idEmployees"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Lastname"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Short"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Email"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Phone"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Locked"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
    },
    'one row contains 8 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 8);
    }
  },
  'Get Customers http://127.0.0.1:3000/tst/kunden': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/kunden' }, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idCustomers,Name,create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idCustomers"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
    },
    'one row contains 3 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 3);
    }
  },
  'Get Customer http://127.0.0.1:3000/tst/kunde': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/kunde' ,qs: {name:'Customer1'}}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idCustomers,Name,create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idCustomers"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
    },
    'one row contains 3 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 3);
    }
  },
  'Get Places http://127.0.0.1:3000/tst/orte': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/orte'}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idPlaces,Name,Position,create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idPlaces"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Position"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
    },
    'one row contains 4 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 4);
    }
  },
  'Get Projects http://127.0.0.1:3000/tst/projekte': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/projekte'}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idProjects,Name,Description,create_time,Customers_idCustomers,Customer,Customer_create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idProjects"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Description"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idCustomer"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Customer"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Customer create time"));
    },
    'one row contains 7 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 7);
    }
  },
  'Get Childprojects http://127.0.0.1:3000/tst/teilprojekte': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/teilprojekte',qs: {name:'Childproject1'}}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: idChildprojects,Name,Description,create_time,Projects_idProjects,Projects_Name,Projekte_Beschreibung,Projects_create_time,Projects_idCustomer,Customer_name,Customer_create_time': function (err, res, body) {
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idChildproject"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Description"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("create_time"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idProject"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project Description"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project create time"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project idCustomer"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Customer name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Customer create time"));
    },
    'one row contains 11 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 11);
    }
  },
  'Get Times http://127.0.0.1:3000/tst/zeiterfassung': {
    topic: function(){
      request({url:'http://127.0.0.1:3000/tst/zeiterfassung',qs: { startDate:  '2005-08-08',
                                                                      endDate:    '2017-08-08',
                                                                      startTime:  '05:00:00',
                                                                      endTime:    '20:00:00'}}, this.callback)
    },
    'should respond with 200': function (err, res, body) {
      assert.equal(res.statusCode, 200); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    },
    'one row contains keys: | idTimes | idEmployee | Lastname | Name | idDuration | Begin | End | idCustomer | Customer | idProject | Project | Project Description | idChildproject | Childproject | Childproject Description | idPlace | Place |': function (err, res, body) {
      console.log(JSON.parse(body)[0]);
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idTimes"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idEmployee"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Lastname"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Name"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idDuration"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Begin"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("End"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idCustomer"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Customer"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idProject"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Project Description"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idChildproject"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Childproject"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Childproject Description"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("idPlace"));
      assert.isTrue(JSON.parse(body)[0].hasOwnProperty("Place"));
    },
    'one row contains 17 keys ': function (err, res, body) {
      assert.isTrue(Object.keys(JSON.parse(body)[0]).length === 17);
    }
  }
}).addBatch({
  'Delete Employee short TST http://127.0.0.1:3000/tst/mitarbeiter': {
    topic: function(){
      request.del({url:'http://127.0.0.1:3000/tst/mitarbeiter',json: { short:'TST'}}, this.callback)
    },
    'should respond with 204': function (err, res, body) {
      assert.equal(res.statusCode, 204); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Delete Project Name Project1 http://127.0.0.1:3000/tst/projekte': {
    topic: function(){
      request.del({url:'http://127.0.0.1:3000/tst/projekte',json: { name:'Project1'}}, this.callback)
    },
    'should respond with 204': function (err, res, body) {
      assert.equal(res.statusCode, 204); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Delete Childproject Name Childproject1 http://127.0.0.1:3000/tst/teilprojekte': {
    topic: function(){
      request.del({url:'http://127.0.0.1:3000/tst/teilprojekte',json: { name: 'Childproject1'}}, this.callback)
    },
    'should respond with 204': function (err, res, body) {
      assert.equal(res.statusCode, 204); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Delete Customer Name Customer1 http://127.0.0.1:3000/tst/kunde': {
    topic: function(){
      request.del({url:'http://127.0.0.1:3000/tst/kunde',json: { name: 'Customer1'}}, this.callback)
    },
    'should respond with 204': function (err, res, body) {
      assert.equal(res.statusCode, 204); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  },
  'Delete Place Name Place1 http://127.0.0.1:3000/tst/orte': {
    topic: function(){
      request.del({url:'http://127.0.0.1:3000/tst/orte',json: { name: 'Place1'}}, this.callback)
    },
    'should respond with 204': function (err, res, body) {
      assert.equal(res.statusCode, 204); //status is 200
    },
    'should not have an error': function (err, res, body) {
      assert.isNull(err);       // We have no error
    },
    'res should be an object': function (err, res, body) {
      assert.isObject(res);       // res is object
    }
  }
}).export(module); // Export the Suite



