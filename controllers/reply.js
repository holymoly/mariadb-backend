var logger = require('../config/logging.js');

// Reply for every route
function replyResult(err, result, code, reply){
  if (err){
    logger.error(err);
    reply({'err':err}).code(code);
    return;
  }
  reply(result).code(code);
};

module.exports.replyResult = replyResult;
