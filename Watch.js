var pj = require('prettyjson'),
    watch = require('watch'),
    c = require('chalk');


module.exports = function(Path, cb) {
    watch.watchTree(Path, function(f, curr, prev) {
        if (typeof f == "object" && prev === null && curr === null) {
            console.log('watcher', c.red(f));
            cb(null, f);
            // Finished walking the tree
        } else if (prev === null) {
            console.log(c.yellow('new file'), c.yellow(f));
            // f is a new file
        } else if (curr.nlink === 0) {
            console.log(c.red('file removed'), c.red(f));
            // f was removed
        } else {
            console.log(c.green('file changed'), c.green(f));
            // f was changed
        }
    });

};