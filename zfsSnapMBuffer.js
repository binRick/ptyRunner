#!/usr/bin/env node

var zfs = require('./node-zfs').zfs,
    trim = require('trim'),
    child_process = require('child_process'),
    zpool = require('./node-zfs').zpool,
    _ = require('underscore'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client,
    c = require('chalk'),
    program = require('commander');

program.version('0.0.1')
    .option('-d, --debug', 'Debug Mode')
    .option('-t, --table', 'Draw Result Table')
    .option('-l, --limit [limit]', 'Display Limit')
    .parse(process.argv);

var cmd = 'ls -al /root';
var server = 'beta';
var callback = function(e, s) {
    if (e) throw e;
    console.log(s);
};

var zfsRecvFlags = '-vF';
var zfsDest = 'tank/sRick/1';

var RemotePort = 9092;
var Snap = 'tank/Rick@zfs-auto-snap-2015-06-17-1820';
var sArray = ['zfs', 'send', Snap];
var mArray = ['mbuffer', '-s', '128k', '-m', '512M', '-O', server + ':' + RemotePort];

var Commands = {
    //    Local: 'zfs send ' + Snap + ' | mbuffer -s 128k -m 512M -O ' + server + ':' + RemotePort,
    Local1: 'zfs send tank/Rick@zfs-auto-snap-2015-06-17-1820 | mbuffer -s 128k -m 1G -O beta:9092',
    Local: 'zfs send tank/Rick@zfs-auto-snap-2015-06-17-1820',
    Remote: 'mbuffer -s 128k -m 512M -I ' + RemotePort + ' | zfs recv ' + zfsRecvFlags + ' ' + zfsDest,
};
if (program.debug) {
    console.log(Commands.Local.split(' ').slice(1));
    console.log(pj.render(Commands));
    process.exit();
}

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
    console.log(c.red('waiting for ssh'));
    conn.on('ready', function() {
        var data = '';
        console.log(c.yellow('ready'));
        setTimeout(function() {
            console.log(c.green('launching'));
            var A = Commands.Local.split(' ')[0];
            var B = Commands.Local.split(' ').slice(1);
            //            console.log(A);
            //            console.log(B);
            //            process.exit();
            var mbufferSend = child_process.spawn('mbuffer', ['-s', '128k', '-m', '512M', '-O', server+':'+RemotePort]);
//            var mbufferSend = child_process.spawn('mbuffer', ['-s', '128k', '-m', '512M', '-O', server, '-i', '-']);
            var zfsSend = child_process.spawn(A, B);
            zfsSend.stdout.pipe(mbufferSend.stdin);
mbufferSend.stdout.on('data', function(data) { 
  console.log(data.toString("utf8")); 
});
/*            zfsSend.on('close', function(e) {
                console.log('zfs send close', e);
            });
            zfsSend.on('error', function(e) {
                console.log('zfs send error', e);
            });
            mbufferSend.on('error', function(e) {
                console.log('mbuf send error', e);
            });
            mbufferSend.on('close', function(e) {
                console.log('mbuf send close', e);
            });*/
            /*            zfsSend.stdout.on('data', function(data) {
                            data = trim(data.toString());
                            console.log(c.green(data));
                        });
                        zfsSend.stderr.on('data', function(data) {
                            data = trim(data.toString());
                            console.log(c.red(data));
                        });
                        zfsSend.on('close', function(code, sig) {
                            console.log(c.green('send closed w'), c.yellow(code));
                        });
            */
        }, 1000);
        conn.exec(Commands.Remote, function(err, stream) {
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
                console.log(c.red.bgWhite(data));
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
