/**
 * Module dependencies
 */

var dmarshal = require('annex-marshal-msgpack-node');
var metric = require('connect-metric');
var createServer = require('./server');

module.exports = function(opts) {
  opts = opts || {};
  opts.marshal = opts.marshal || dmarshal;
  var app = createServer(opts);

  app.use(function logger(req, res, next) {
    var start = Date.now();
    res.on('end', function() {
      req.metric({
        at: 'info',
        module: req.module,
        method: req.method,
        ip: req.ip,
        service: (Date.now() - start) + 'ms',
        status: res.statusCode,
        bytes: res._headers['content-length']
      });
    })
    next();
  });
  app.use(metric((opts.metric||{}).context, (opts.metric||{}).options));

  return app;
};
