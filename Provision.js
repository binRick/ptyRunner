#!/usr/bin/env node

var yaml = require('yaml-to-json').yaml,
    Ansible = require('node-ansible'),
    pj = require('prettyjson'),
    fs = require('fs');
SteamServer = require('./SteamServer');
//var promise = new Ansible.AdHoc().module('shell').hosts(SteamServer.Host).args(SteamServer.Commands.test.join(' && ')).exec();
//console.log(SteamServer.Playbooks.Install);
//process.exit();

var Command = process.argv[3] || '',
    op = process.argv[4] || 'run';

fs.writeFileSync('./.playbook.yml', SteamServer.Playbooks[Command]);

var pb = yaml.safeLoadAll(fs.readFileSync('./.playbook.yml'));

//console.log(SteamServer.Playbooks[Command].length);
//console.log(pj.render(SteamServer.Playbooks[Command]));
fs.writeFileSync('./.inventory', '[steamServers]\n' + SteamServer.Inventory.join('\n'));
var Options = ['listHosts', 'listTasks', 'listPlaybooks', 'runPlaybook', 'testPlaybook'];

//cat _SteamServer_Install.json | prettyjson
if (Command == '') {
    console.log('\n' + pj.render({
        Options: Options,
    }, {
        inlineArrays: true
    }) + '\n');
    process.exit();
}
if (Command == 'listHosts') {
    var promise = new Ansible.Playbook().inventory('.inventory').playbook('.playbook').variables(SteamServer.Variables).verbose(SteamServer.Verbose).listTasks(true).listHosts(true).exec();
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


    promise.then(function(successResult) {
        console.log(pj.render(successResult));
    }, function(error) {
        console.error(error);
    });

}
