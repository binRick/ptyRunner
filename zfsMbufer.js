#!/usr/bin/env node

var c = require('chalk'),
    status = require('node-status'),
    async = require('async'),
    _ = require('underscore'),
    fs = require('fs'),
    trim = require('trim'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client;

var limit = 10;
var cmd = 'ls -al /root';
var server = 'beta';
var callback = function(e, s) {
    if (e) throw e;
    console.log(s);
};
var conn = new Client();
var start = new Date().getTime();
conn.on('ready', function() {
    var data = '';
    conn.exec(cmd, function(err, stream) {
        if (err) throw err;
        stream.on('close', function(code, signal) {
            conn.end();
        }).on('data', function(data) {
            data = trim(data.toString());
            //                                if (typeof(Command.process) == 'function')
            //                                    data = Command.process(data);
            callback(null, {
                server: server,
                cmd: cmd,
                //                                    key: Command.key,
                //                                    title: Command.title,
                started: start,
                millisecs: new Date().getTime() - start,
                ts: new Date().getTime(),
                data: data,
            });
        }).stderr.on('data', function(data) {
            //                                console.log(c.red.bgWhite('STDERR: ' + data));
            //                            callback(data, null);
        });
    });
}).connect({
    host: server,
    port: 22,
    username: 'root',
    privateKey: require('fs').readFileSync('/root/.ssh/id_rsa')
});
