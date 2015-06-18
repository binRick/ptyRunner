#!/usr/bin/env node

var zfs = require('./node-zfs').zfs,
    zpool = require('./node-zfs').zpool,
    _ = require('underscore'),
    pj = require('prettyjson'),
    c = require('chalk'),
    program = require('commander');

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
        var Cols = ["", "Filesystem", "Used Bytes",'Remote','Connection','Filesystems'];
        var Attrs = [];
        Attrs.push({
            row: [0, 1]
        }, {
            align: "center",
            color: "green",
            bg: "black"
        });

        var Rows = [];
        //        Rows.push(["✓", "Arma3Server", "arma3server", "tty.js", "xxxx", "xxx"]);
        _.each(data_s, function(d) {
            Rows.push(["✓", d.name, d.used, d.remote]);

        });
        //Rows.push(["x", "Arma3Server", "arma3server", "tty.js", "xxxx", "xxx"]);

        Tabular(Cols, Rows, Attrs, 10000);
    }
});
