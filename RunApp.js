#!/usr/bin/env node

var _ = require('underscore'),
    async = require('async'),
    pj = require('prettyjson'),
    c = require('chalk'),
    pty = require('pty.js');

var App = process.argv[2] || 'SteamServer',
    Setup = require('./' + App),
    Command = process.argv[3] || 'Install',
    Monitor = require('./Monitor');

var child = pty.spawn('setuidgid', [Setup.User, Setup.Shell], {
    name: Setup.PtyName || 'myPty',
    cols: Setup.Columns,
    rows: Setup.Rows,
    cwd: Setup.Home,
});

Setup.Pid = child.pid;
Monitor(Setup);


//console.log(c.green('\nApplication Config:'));
//console.log(pj.render(Setup));
console.log(c.green('Running', Command, ' Commands'));
console.log('\n\n');

Setup.Lines = [];
Setup.Responses = [];

child.on('data', function(data) {
    var Lines = data.split('\n');
    _.each(Lines, function(l) {
        Setup.Lines.push(l);
    });
    if (Setup.PromptReceived(data)) {
        var response = Setup.PromptResponse(data);
        Setup.Responses.push({
            stdout: data,
            response: response
        });
        child.write(response + '\n');
    }
});


async.map(Setup.Commands[Command], function(cmd, cb) {
    child.write(cmd + '\r');
    cb(null, {
        cmd: cmd
    });
}, function(e, outs) {
    child.write('exit\r');
});
/*
_.each(Setup[Command], function(c){
child.write(c+'\r');
});
    child.write('exit\r');
*/
