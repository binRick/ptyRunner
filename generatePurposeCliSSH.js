#!/usr/bin/env node

var zfs = require('./node-zfs').zfs,
trim = require('trim'),
    zpool = require('./node-zfs').zpool,
    _ = require('underscore'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client,
    c = require('chalk'),
    program = require('commander');


var cmd = 'ls -al /root';
var server = 'beta';
var callback = function(e, s) {
    if (e) throw e;
    console.log(s);
};

program
    .version('0.0.1')
    .option('-d, --debug', 'Debug Mode')
    .option('-t, --table', 'Draw Result Table')
    .option('-l, --limit [limit]', 'Display Limit')
    .parse(process.argv);
zfs.list(function(err, fields, data) {
    if (err) throw err;
    var data_s = _.sortBy(data.map(function(m) {
        return {
            name: m[0],
            used: parseInt(m[1]),
        };
    }), 'used').filter(function(m) {
        return m.name.split('/')[1] == 'Snapshots' && m.name.split('/').length > 2;
    }).map(function(m) {
        m.remote = m.name.split('/')[2];
        return m;
    }).reverse().slice(0, program.limit || 4);

    if (program.debug)
        console.log(pj.render(data_s, {
            inlineArrays: true
        }));

    if (program.table) {
        var Tabular = require('./myTabular');
        var Cols = ["", "Filesystem", "Used Bytes", 'Remote', 'Connection', 'Filesystems'];
        var Attrs = [];
        Attrs.push({
            row: [0, 1]
        }, {
            align: "center",
            color: "green",
            bg: "black"
        });

        var Rows = [];
        _.each(data_s, function(d) {
            Rows.push(["✓", d.name, d.used, d.remote]);

        });
        Tabular(Cols, Rows, Attrs, 10000);
    }
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
});
