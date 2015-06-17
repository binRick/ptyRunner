#!/usr/bin/env node

process.title = 'routerManager';
var CheckPointChecks = require('./CheckPointChecks'),
    pj = require('prettyjson'),
    RunDeviceChecks = require('./RunDeviceChecks'),
    ciscoparse = require('ciscoparse'),
    fs = require('fs'),
    _ = require('underscore'),
    check = "✓",
    c = require('chalk'),
    blessed = require('./blessed'),
    util = require('util'),
    screen,
    Routers = require('./Devices').Routers,
    DeviceData = {
        Versions: [
            //        ['Device', 'Passed', 'Failed', 'Net Status'],
            ['Device', 'Passed', 'Failed', 'Pending Action', 'Net Status'],
        ],
        Routers: [
            ['Devices  ', 'Connection'],
            ['Car1', c.green(check)],
            ['Car2', c.red(check)],
            ['Car3', c.yellow(check)],
        ],
        ASAs: [
            ['Devices'],
            ['asa1', ],
            ['asa2', ],
        ]
    };
var FailedChecksTableData = [
    ['Device', 'Check', 'Received', 'Retry'],
];
screen = blessed.screen({
    smartCSR: true,
    log: process.env.HOME + '/blessed-terminal.log'
});


/* TABLE VERSIONS */
var tableVersions = require('./Tables/Versions')(screen, blessed);
tableVersions.setData(DeviceData.Versions);

/*  LEFT */
var left = require('./ConsoleWidget')(screen, blessed);
left.pty.on('data', function(data) {
    screen.log(JSON.stringify(data));
});

var I = 0;
var RD = [];
_.each(Routers, function(R) {
    var data = fs.readFileSync(R + '.ver');
    var parser = ciscoparse.parse(data);
    var rT = require('./ConsoleMiniWidget')(screen, blessed, 2 + I * 20, ['-t', 'rick@desmoines', 'router', R], R);
    I++;
    RunDeviceChecks(rT.tty, CheckPointChecks.Matches.filter(function(M) {
        return typeof(M.DisplayType) == 'undefined' || _.contains(M.DisplayType, 'Group');
    }), function(err, DeviceCheckResults) {
        if (err) throw err;
        /*
                _.each(DeviceCheckResults.FailedDetails[0], function(fd) {
                    var FD = ['abc', c.green(check), c.red(check), 'asd'];
                    FailedChecksTableData.push(FD);
                });
        */
        var TT = c.black.underline.bgWhite.bold(DeviceCheckResults.PassedDetails[0].match.toString());
        var Presentation = {
            MatchFunction: TT,
            MatchResult: DeviceCheckResults.PassedDetails[0].Result,
            CheckOutput: DeviceCheckResults.PassedDetails[0].Output,
        };
        var a = {
            asdb: 'asdsa'
        };
        var P = pj.render(Presentation);
        var SS = c.green(check);
        //        DeviceData.Versions.push([R, c.green(String(DeviceCheckResults.Passed.join(' '))), SS]);
        rT.on('title', function(title) {
            screen.title = title;
        });
        rT.on('click', rT.focus.bind(rT));
    });

});


[left].forEach(function(term) {
    term.on('title', function(title) {
        screen.title = title;
    });
    term.on('click', term.focus.bind(term));
});

var FC = require('./Tables/FailedChecks');
var FailedChecksTable = FC(screen, blessed);



var deviceTable = blessed.table({
    parent: screen,
    top: 0,
    left: 95,
    label: 'Inventory',
    data: null,
    border: 'line',
    tags: true,
    keys: true,
    vi: true,

    mouse: true,
    style: {
        border: {
            fg: 'red'
        },
        header: {
            fg: 'white',
            bold: true
        },
        cell: {
            fg: 'green',
            selected: {
                bg: 'green'
            }
        }
    }
});






var dataB = [
    ['Device', 'Prop', 'Age', 'Value'],
    ['Car1', 'Ver', '35 min', '10.22'],
    ['Car2', 'Ver', '2 days', '10.21'],
];


//data[1][0] = '{red-fg}' + data[1][0] + '{/red-fg}';
dataB[2][0] = '{red-fg}' + dataB[2][0] + '{/red-fg}';

FailedChecksTable.setData(FailedChecksTableData);
deviceTable.setData(DeviceData.Routers);


//screen.on('mouse', function(data) {
//console.log('ok data', data.x, data.y, data.raw, util.inspect(data));
// util.inspect(data));
// program.cup(data.y, data.x);
//  program.write(' ', 'blue bg');
//  program.cup(0, 0);
//  program.write(util.inspect(data));
//});








screen.key('C-c', function() {
    return process.exit(0);
});

setTimeout(function() {
    screen.render();
    setTimeout(function() {
        left.focus();
    }, 200);
}, 200);
