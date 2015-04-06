var fs = require('fs'),
    j2y = require('json2yaml');

//console.log(process.env); process.exit();

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
    Inventory: ['127.0.0.1', 'cs', 'arma3'],
    Shell: 'bash',
    Columns: 80,
    Rows: 30,
    PtyName: 'SteamAutomation',
    Period: 1000,
    Max: {
        Runtime: 55000,
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
    Prompt: '[y/N]',
    User: 'arma3server',
    Home: '/home/arma3server',
    Commands: {
        test: ['echo hello', 'id', 'ls', 'w'],
        //npm: ['/usr/bin/git clone https://github.com/yaronn/blessed-contrib', 'cd blessed-control', 'npm install','for x in browserify express pm2 grunt-cli karama; do npm install $x; done'],
        //npm: ['/usr/bin/git clone https://github.com/yaronn/blessed-contrib', 'cd blessed-control', 'npm install','for x in browserify express pm2 grunt-cli karama; do npm install $x; done'],
        npm: ['cd /home/arma3server', 'ls -al node_modules', 'npm install '+process.env.NPMmodule || 'request'], 
        Install: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server auto-install'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Help: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server'],
//ttyrec ~/.tty.recording && seq2gif < ~/.tty.recording > /var/www/html/wow.gif
//
//        Details: ['/usr/bin/ttyrec rec','cd /home/arma3server','source .bashrc', 'ls -al arma3server', 'chmod +x arma3server', './arma3server details','netstat -atunp | grep arma3server','exit','seq2gif < ~/.tty.recording > /var/www/html/wow.gif'],
        Details: ['cd /home/arma3server','source .bashrc', 'ls -al arma3server', 'chmod +x arma3server', './arma3server details','netstat -atunp | grep arma3server'],
        Validate: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server validate'],
        Stop: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server stop'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Restart: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server restart'],
        Update: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server update'],
    },
};
