#!/usr/bin/env node

//var promise = playbook.exec();
var Ansible = require('./node-ansible'),
    pj = require('prettyjson'),
    fs = require('fs');
SteamServer = require('./SteamServer');
//var promise = new Ansible.AdHoc().module('shell').hosts(SteamServer.Host).args(SteamServer.Commands.test.join(' && ')).exec();
//console.log(SteamServer.Playbooks.Install);
//process.exit();

var Command = process.argv[2] || '',
    op = process.argv[3] || 'run';

//
//
fs.writeFileSync('./.playbook.yml', SteamServer.Playbooks[Command]);
fs.writeFileSync('./.inventory', '[steamServers]\n' + SteamServer.Inventory.join('\n'));

var Options = ['listHosts','listTasks','listPlaybooks','runPlaybook','testPlaybook'];


if (Command == '') {
    console.log('\n' + pj.render({
        Options: Options,
    }, {
        inlineArrays: true
    }) + '\n');
    process.exit();

}
if (Command == 'list') {
    console.log('\n' + pj.render({
        Playbooks: Object.keys(SteamServer.Playbooks)
    }, {
        inlineArrays: true
    }) + '\n');
    process.exit();
}
if (op == 'list') {
    console.log(pj.render(SteamServer.Playbooks[Command]));

}

if (op == 'run') {
    var promise = new Ansible.Playbook().inventory('.inventory').playbook('.playbook').variables(SteamServer.Variables).verbose(SteamServer.Verbose).exec();
    //var promise = new Ansible.Playbook().inventory('.inventory').playbook('.playbook').variables(SteamServer.Variables).verbose(SteamServer.Verbose).listTasks(true).listHosts(true).exec();


    promise.then(function(successResult) {
        console.log(pj.render(successResult));
    }, function(error) {
        console.error(error);
    });

}
