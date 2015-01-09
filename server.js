/**
 * Module dependencies
 */

var Server = require('annex-ws-node').Server;
var http = require('http');
var stack = require('connect-stack');
var pns = require('pack-n-stack');

module.exports = function createServer(opts) {
  var server = http.createServer();

  server.stack = [];
  server.handle = stack(server.stack);

  server.use = function(fn) {
    fn.handle = fn;
    server.stack.push(fn);
    return server;
  };

  var routes = server.routes = {};

  var hasPushedRouter = false;
  server.register =
  server.fn = function(modName, fnName, cb) {
    var mod = routes[modName] = routes[modName] || {};
    var fn = mod[fnName] = mod[fnName] || [];
    fn.push(cb);
    server.emit('register:call', modName, fnName);
    if (hasPushedRouter) return server;
    server.use(router);
    hasPushedRouter = true;
    return server;
  };

  function router(req, res, next) {
    var mod = routes[req.module];
    if (!mod) return next();
    var fn = mod[req.method];
    if (!fn) return next();
    // TODO support next('route')
    fn[0](req, res, next);
  }

  var wss = new Server({server: server, marshal: opts.marshal});

  wss.listen(function(req, res) {
    // TODO do a domain here
    server.handle(req, res, function(err) {
      if (!res._sent) {
        err ? res.error(err.message) : res.error(req.module + ':' + req.method + ' not implemented');
        if (err) console.error(err.stack || err.message);
      }
    });
  });

  return server;
}
