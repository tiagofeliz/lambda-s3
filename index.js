const Lambda = require('./src/Lambda')

exports.handler = function(event, context, callback) {
    let lambda = new Lambda();
    lambda.main(event, callback);
};