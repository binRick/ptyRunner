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

var HandleMbufferStdErr = function(str) {
    str = str.toString('utf8');


    if (str.split('Address already in use') > 0) {
        console.log(c.red.bgBlack('Address is in use on remote'));
    }
    return console.log(c.green.bgBlack(str));
    err = trim(String(str));
    var aP = str.split(' ');
    var strO = {
        inRate: aP[2] + ' ' + a[3], //.replace(/,/,''),
        outRate: aP[6] + ' ' + a[7], //.replace(/,/,''),
        total: aP[8] + ' ' + a[9],
        bufferPercentageFull: aP[12],
    };
    console.log(c.red.bgBlack(str));
};

var cmd = 'ls -al /root';
var server = 'beta';
var callback = function(e, s) {
    if (e) throw e;
    console.log(s);
};

var zfsRecvFlags = '-F';
var zfsDest = 'tank/sRick/1';

var RemotePort = 9092;
var Snap = 'tank/Rick@zfs-auto-snap-2015-06-17-1820';
var sArray = ['zfs', 'send', Snap];
var mArray = ['mbuffer', '-s', '128k', '-m', '512M', '-O', server + ':' + RemotePort];

var Commands = {
    //    Local: 'zfs send ' + Snap + ' | mbuffer -s 128k -m 512M -O ' + server + ':' + RemotePort,
    Local1: 'zfs send tank/Rick@zfs-auto-snap-2015-06-17-1820 | mbuffer -s 128k -m 1G -O beta:9092',
    Local: String('zfs send tank/Rick@zfs-auto-snap-2015-06-17-1820').split(' '),
    Remote: 'mbuffer -s 128k -m 512M -I ' + RemotePort + ' | zfs recv ' + zfsRecvFlags + ' ' + zfsDest,
};
if (program.debug) {
    console.log(Commands.Local.split(' ').slice(1));
    console.log(pj.render(Commands));
    process.exit();
}
/*
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
*/
var conn = new Client();
var start = new Date().getTime();
console.log(c.red('waiting for ssh'));
conn.on('ready', function() {
    var data = '';
    console.log(c.yellow('ready'));
    setTimeout(function() {
        console.log(c.green('launching'));
        var mbufferSend = child_process.spawn('mbuffer', ['-s', '128k', '-m', '512M', '-O', server + ':' + RemotePort]);
        var zfsSend = child_process.spawn(Commands.Local[0], Commands.Local.slice(1));
        zfsSend.stdout.pipe(mbufferSend.stdin);
        mbufferSend.stdout.on('data', function(data) {
            console.log(data.toString("utf8"));
        });
        zfsSend.on('close', function(e) {
            console.log('zfs send process exited with code', c.green(e));
        });
        zfsSend.on('error', function(e) {
            console.log(c.red('zfs send err', e));
        });
        mbufferSend.on('error', function(e) {
            console.log('mbuf send error', e);
        });
        mbufferSend.on('close', function(e) {
            console.log('mbuf send close', e);
        });

    }, 1000);
    conn.exec(Commands.Remote, function(err, stream) {
        if (err) throw err;
        stream.on('data', function(data) {
            data = data.toString('utf8');
            console.log(c.red.bgWhite(data));
        });
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
        }).stderr.on('data', HandleMbufferStdErr);
    });
}).connect({
    host: server,
    port: 22,
    username: 'root',
    privateKey: require('fs').readFileSync('/root/.ssh/id_rsa')
});
//});