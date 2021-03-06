var trim = require('trim'),
    child_process = require('child_process'),
    _ = require('underscore'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client,
    c = require('chalk'),
    C = console.log;

var server = 'beta';
var RemotePort = '9092';
var zfsFSSnap = 'tank/Rick@123123';


module.exports = function(program) {
    //  C(c.green(program));
    C(pj.render(program));

    C(c.green('launching'));
    var mbufferSend = child_process.spawn('mbuffer', ['-s', '128k', '-m', '512M', '-O', server + ':' + RemotePort]);
    var zfsSend = child_process.spawn('zfs', ['send', zfsFSSnap]);
    zfsSend.stdout.pipe(mbufferSend.stdin);
    zfsSend.stdout.on('data', function(data) {
        console.log(c.green.bgWhite(data.toString("utf8")));
    });
    zfsSend.stderr.on('data', function(data) {
        console.log(c.red.bgWhite(data.toString("utf8")));
    });
    mbufferSend.stdout.on('data', function(data) {
        console.log(c.green.bgBlack(data.toString("utf8")));
    });
    mbufferSend.stderr.on('data', function(data) {
        console.log(c.red.bgBlack(data.toString("utf8")));
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



};