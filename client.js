/**
 * Module dependencies
 */

var Client = require('annex-ws-node').Client;
var marshal = require('annex-marshal-msgpack-node');

module.exports = function(url, service, host) {
  if (!url) {
    console.warn('service not registered with durga server');
    return undefined;
  }

  var client = new Client(url, {marshal: marshal});

  client.register = function(type, mod, fn, args, res) {
    client.call('services', 'register', [service, host, type, [mod, fn], args, res]);
  };

  return client;
};
