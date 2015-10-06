var replyResult = require('./reply.js'); // send the reply back
var query = require('../query'); //contains all queries
var logger = require('../config/logging.js');

var bcrypt = require('bcrypt');

module.exports.login = {
  description: 'Verifys the Login',
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
              return replyResult.replyResult(err,[{ 'valide': true }],code,reply);
          } else {
            // Password wrong
            return replyResult.replyResult(err,[{ 'valide': false }],code,reply);
          }
        });
      }else{
        // User wrong
        return replyResult.replyResult(err,[{ 'valide': false }],code,reply);
      }
    });
  },
  plugins: {
    'hapi-auth-cookie': {redirectTo: false}
  }
};
