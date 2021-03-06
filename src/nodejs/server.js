'use strict';
const cluster = require('cluster');
if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  cluster.on( 'online', function( worker ) {
    console.log( 'Worker ' + worker.process.pid + ' is online.' );
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker %d died.', worker.id);
    cluster.fork();
  });
} else {
  const express = require('express'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    app = express(),
    tools = require('./api/routes/toolRoutes');

  app.use(function (req, res, next) {
    if (!res.getHeader('Cache-Control')) {
      res.setHeader('Cache-Control', 'public, max-age=600');
    }
    res.header("Access-Control-Allow-Origin", "localhost:" + port);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use('/public/', express.static('static'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  tools(app);

  app.listen(port, 'localhost');
  console.log('api worker started on port ' + port);
}
