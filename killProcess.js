var psTree = require('ps-tree'),
    child = require('child_process');



module.exports = function(pid, cb) {
    psTree(pid, function(err, children) {
        var killCmd = 'kill ' + ['-9'].concat(children.map(function(p) {
            return p.PID
        })).join(' ');
        console.log(killCmd);
        process.exit();
        //        child.spawn(killCmd);
        cb(null, {});
    });
};