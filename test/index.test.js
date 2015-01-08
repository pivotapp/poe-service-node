/**
 * Module dependencies
 */

var service = require('../');

var app = module.exports = service();

app.use(function test(req, res, next) {
  req.metric.count('requests', 1);
  next();
});

app.register('math', 'random', function(req, res) {
  res.send(Math.random());
});
