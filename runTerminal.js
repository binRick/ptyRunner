#!/usr/bin/env node



var TerminalList = require('./TerminalList'),
    terminalConfig = require('./terminalConfig');

TerminalList.DrawSelect(terminalConfig.Tasks, function(e, SelectedTask) {
    if (e) throw e;
    TerminalList.DrawSelect(terminalConfig.Hosts, function(e, SelectedHost) {
        if (e) throw e;
        console.log(SelectedHost);
        console.log(SelectedTask);
    });
});