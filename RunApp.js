#!/usr/bin/env node

var _ = require('underscore'),
    ScreenShot = require('./ScreenShot'),
    Watch = require('./Watch'),
    fs = require('fs'),
    async = require('async'),
    pj = require('prettyjson'),
    c = require('chalk'),
    pty = require('pty.js');

var App = process.argv[2] || 'SteamServer',
    Setup = require('./' + App),
    Command = process.argv[3] || 'Install',
    Monitor = require('./Monitor');

var E = process.env;
E.NPMmodule = process.env.NPMmodule || "request";
E.PORT = process.env.PORT || 8000;


var Logs = {
    stdout: '/tmp/stdout.log',
    debug: '/tmp/debug.log',
};

/*
ScreenShot({
    delay: 1,
    dest: '/var/www/html',
    uri: 'http://yahoo.com',
}, function(e, images) {
    if (e) throw e;
    console.log(pj.render(images));

});
*/


Watch(Setup.Home, function(e, WatchStat) {
    if (e) throw e;
    //   console.log(WatchStat);
    E.HOME = Setup.Home;
    var child = pty.spawn('setuidgid', [Setup.User, Setup.Shell], {
        name: Setup.PtyName || 'myPty',
        cols: Setup.Columns,
        rows: Setup.Rows,
        cwd: Setup.Home,
        env: E,
    });

    Setup.Pid = child.pid;

    var Monitors = {
        Cleared: function() {},
    };

    Monitor(Setup, Monitors);

    console.log(c.green('Running', Command, ' Commands'));
    console.log('\n\n');
    fs.appendFile(Logs.debug, '\n\n' + c.red('Running new pty\n'), function(err) {});

    Setup.Lines = [];
    Setup.Responses = [];

    child.on('data', function(data) {
        fs.appendFile(Logs.stdout, data, function(err) {
            if (err) throw err;
            var Lines = data.split('\n');
            _.each(Lines, function(l) {
                Setup.Lines.push(l);
            });
        });
        var response = Setup.PromptReceived(data);
        fs.appendFile(Logs.debug, '\n' + c.green('Response received: \n\t"' + pj.render(data.split('\t\n')) + '"\n'));
        if (response && (typeof(response) == 'string' || typeof(response) == 'object')) {
            if (typeof(response) == 'string') {
                var r = [response];
                response = r;
            }
            _.each(response, function(r) {
                fs.appendFile(Logs.debug, '\n\n' + c.green('Sending Response: "' + r + '"'));
                Setup.Responses.push({
                    stdout: data,
                    response: r
                });
                setTimeout(function() {
                    child.write(r + '\n');
                }, 500);
            });
        }

    });


    async.map(Setup.Commands[Command], function(cmd, cb) {
        setTimeout(function() {
            child.write(cmd + '\r');
            cb(null, {
                cmd: cmd
            });
        }, 2000);
    }, function(e, outs) {
        child.write('exit\r');
        //console.log(outs);
    });

});
/*
_.each(Setup[Command], function(c){
child.write(c+'\r');
});
    child.write('exit\r');
*/
