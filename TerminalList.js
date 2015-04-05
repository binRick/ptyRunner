var Menu = require('terminal-menu'),
    trim = require('trim'),
    menu = Menu({
        width: 45,
        x: 4,
        y: 2
    }),
    child = require('child_process'),
    execSync = require('execSync'),
    pj = require('prettyjson'),
    _ = require('underscore');


module.exports = {
    DrawSelect: function(TerminalConfigItem, cb) {
            var AnsibleFilter = function(items){ return _.uniq(items).map(function(a) {
                return trim(a);
            }).filter(function(a) {
                return a.length > 0
            });
            },
            Items = AnsibleFilter(execSync.exec(TerminalConfigItem.cmd).stdout.split('\n'));
console.log(pj.render(TerminalConfigItem));
/*
process.exit();
*/
        menu.reset();
        menu.write('' + TerminalConfigItem.Title || 'unspecified Title' + '\n');
        menu.write('-----\n');

        menu.add('all');
        _.each(Items, function(T) {
            menu.add(trim(T.substring(0, TerminalConfigItem.StringLimit)));
        });
        menu.add('EXIT');

        menu.on('select', function(label) {
            menu.close();
            cb(null, label);
        });
        process.stdin.pipe(menu.createStream()).pipe(process.stdout);

        process.stdin.setRawMode(true);
        menu.on('close', function() {
 //           process.stdin.setRawMode(false);
            process.stdin.end();
        });

    },
};
