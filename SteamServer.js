module.exports = {
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
        npm: ['git clone https://github.com/yaronn/blessed-contrib', 'cd blessed-control', 'npm install'],
        Install: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server validate', 'history', 'ls', 'exit'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Help: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server'],
        Details: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server details'],
        Validate: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server validate'],
        Stop: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server stop'],
        Start: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server start'],
        Restart: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server restart'],
        Update: ['cd /home/arma3server', 'ls -al arma3server', 'chmod +x arma3server', './arma3server update'],
    },
};
