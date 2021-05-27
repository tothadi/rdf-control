#!/usr/bin/env node

/**
 * Module dependencies.
 */

const
  app = require('../app'),
  debug = require('debug')('rdf-control:server'),
  http = require('http'),
  port = normalizePort(process.env.PORT || '8080')

app.set('port', port);

/**
 * Create HTTP server.
 */

const
  server = http.createServer(app),
  io = require('socket.io')(server);

exports.io = io

const scale = require('../api/controllers/scale');

require('../api/controllers/control');

io.on('connection', function (client) {

  client.emit('connectStatus', 'server connected')

  client.on('barrier', data => {
    console.log(data)
    scale.weigh(data)
  })

  client.on('join', function (data) {
    console.log(data)
  });

  client.on('disconnect', function () {
    console.log('Client disconnected')
  })

})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('Server listening on port ' + port);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
