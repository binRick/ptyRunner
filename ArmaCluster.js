#!/usr/bin/env node



var service = require("cluster-service");

service.start({
    workers: process.argv[2] || './tServer.js',
    count: 1,
    restart: false,
    cwd: process.cwd(),
    accessKey: "12345",
    host: '0.0.0.0',
    port: 23223,
    cli: true,
    allowHttpGet: true,
    restartOnMemUsage: true,
    restartOnUpTime: true,
    workerCount: 1
});