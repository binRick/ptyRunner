var MonitorPid = require('monitor-pid');

var pj = require('prettyjson'),
    c = require('chalk'),
    killProcess = require('./killProcess'),
    clear = require('clear');


p = {
    //  keysColor: 'white',
    //  dashColor: 'magenta',
    //  stringColor: 'white',
    inlineArrays: true,
};

module.exports = function(Setup, cb) {
    var id = 0;

    cb.Cleared = cb.Cleared || function() {};

    Setup.Stats = [];
    var mp = new MonitorPid(Setup.Pid, {
        period: Setup.Period
    });
    mp.on('monitored', function(pid, stats) {
        clear();
        cb.Cleared();
        //        console.log(c.green('monitored', pid));
        stats.id = id;
        id++;
        Setup.Stats.push(stats);
        //       console.log('\n' + pj.render(Setup.Lines) + '\n');
        //       console.log('\n' + pj.render(Setup.Lines) + '\n');
        //        console.log('\n' + Setup.Lines + '\n');
        //        console.log('\n' + pj.render({Lines: Setup.Lines.length}) + '');
 //       console.log('' + pj.render({
 //           Respones: Setup.Responses.map(function(r) {
 //               return r.response;
 //           })
 //       }, p) + '\n');
        //       console.log('\n' + pj.render('Responses Detected: '  Setup.Respones.length) + '\n');
        //        console.log('\n' + pj.render({PromptResponses:Setup.Responses.length, Respones: Setup.Respones}, p) + '\n');
        //        console.log('\n' + pj.render({Responses:Setup.Responses}, p) + '\n');
        var FILES = [];
Setup.Max = Setup.Max || {};
Setup.Max.Runtime = Setup.Max.Runtime || 300;


        console.log('\n' + pj.render({
            date: stats.date,
            Files: FILES,
            pids: stats.pids,
            cpu: stats['%CPU'],
            memPercent: stats['%MEM'],
            polls: stats.id,
            monitorTime: stats.monit_time,
            minorFaultsperSec: stats['minflt/s'],
            time: stats.time,
            timelimit: Setup.Max.Runtime,
            io: [stats['kB_rd/s'], stats['kB_wr/s']],
            mem: stats.VSZ,
            rss: stats.RSS
        }, p) + '\n\n');
    });

    mp.on('end', function(pid) {
        //       console.log(c.green('Ended', pid));
        Setup.Ended({});
        process.exit();


    });

    mp.on('error', function(err) {
        console.log(c.red('ERROR', err));
    });

    mp.start();
    setTimeout(function() {
        console.log(c.bold.red('maxTime of', Setup.Max.Runtime, 'reached. Stopping...'));
        mp.stop();
        killProcess(Setup.Pid, function(e, killpidInfoObject) {
            Setup.Killed('maxRuntime', {
                started: 123,
                ended: 123
            });
        });
    }, Setup.Max.Runtime);
};
