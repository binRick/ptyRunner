var Menu = require('terminal-menu');
var menu = Menu({
    width: 29,
    x: 4,
    y: 2
});
_ = require('underscore'),
    child = require('child_process'),
    fs = require('fs');

var Games = fs.readFileSync('./games.txt').toString().split('\n');
console.log(Games);
menu.reset();
menu.write('Select Game\n');
menu.write('-------------------------\n');

_.each(Games, function(g) {
    menu.add(g);
});
menu.add('EXIT');
menu.on('select', function(label) {
    menu.close();
    console.log('SELECTED: ' + label);
});
process.stdin.pipe(menu.createStream()).pipe(process.stdout);

process.stdin.setRawMode(true);
menu.on('close', function() {
    process.stdin.setRawMode(false);
    process.stdin.end();
});
//   };