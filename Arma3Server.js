var fs = require('fs'),
    j2y = require('json2yaml');
 
process.env.NPMmodule = process.env.NPMmodule || 'request';


module.exports = {
    Host: '127.0.0.1',
    Verbose: 'vv',
    Variables: {
        somethingCool: 12354,
	RPMs: ['libstdc++','libstdc++.i686'],
    },
    Playbooks: {
        Install: j2y.stringify(JSON.parse(fs.readFileSync('./_SteamServer_Install.json').toString())),
        Test: j2y.stringify(JSON.parse(fs.readFileSync('./_Test.json').toString())),
    },
    Inventory: ['127.0.0.1', 'cs', 'arma3','csgo'],
    Shell: 'bash',
    Columns: 80,
    Rows: 30,
    PtyName: 'SteamAutomation',
    Period: 1000,
    Max: {
        Runtime: 500000,
    },
    PromptReceived: function(stdout) {
        return stdout.split('[y/N]').length > 1;
    },
    PromptResponse: function(stdout) {
        return 'y';
    },
    Killed: function(reason, ptyObject) {
        console.log('killed w reason', reason, ptyObject);
    },
    Ended: function(e) {

    },
Ports: {
udp: [2302,2303,2304],
}, 
    name: 'Arma3Server', 
    Prompt: '[y/N]',
    User: 'arma3server',
    Home: '/home/arma3server',
    Commands: {
        test: ['echo hello', 'id', 'ls', 'w'],
        npm: ['cd /home/arma3server','cd node_modules && ls && ls '+process.env.NPMmodule+' && rpm remove '+process.env.NPMmodule, 'cd /home/arma3server && npm install '+process.env.NPMmodule+' && cd node_modules/'+process.env.NPMmodule+' && npm test && ./bin/tty.js -p '+process.env.PORT||8080],
        ttyjs: ['cd /home/arma3server','cd node_modules && ls && ls '+process.env.NPMmodule+' '+process.env.NPMmodule,'cd /home/arma3server && npm install '+process.env.NPMmodule+' && cd node_modules/'+process.env.NPMmodule+' && '+process.env.Exec],
        anyproxy: ['cd /home/arma3server','npm --dev install anyproxy && ./node_modules/anyproxy/test.sh'],
// && npm install '+process.env.NPMmodule+' && cd node_modules/'+process.env.NPMmodule+' && npm test && ./bin/tty.js -p '+process.env.PORT||8080],
        Install: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server auto-install'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Help: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server'],
        Details: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server details','netstat -atunp | grep arma3server'],
        Validate: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server validate'],
        Stop: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server stop'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Restart: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server restart'],
        Update: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server update'],
    },
};
