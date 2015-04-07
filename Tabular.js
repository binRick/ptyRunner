var Table = require("terminal-table"),
    clear = require('clear'),
    _ = require('underscore');

var multimeter = require('multimeter');
var multi = multimeter(process);

multi.drop(function (bar) {
    var iv = setInterval(function () {
        var p = bar.percent();
        bar.percent(p + 1);

        if (p >= 100) clearInterval(iv);
    }, 25);
});


module.exports = function(Columns, Rows, Attrs, Interval) {

    setInterval(function() {
        var t = new Table({
            borderStyle: 2,
            horizontalLine: true,
            width: [3, "10%", "10%", "10%", "10%", "10%"],
            rightPadding: 0,
            leftPadding: 1
        });
        t.push(Columns);
        _.each(Rows, function(r) {
            t.push(r);
        });

        _.each(Attrs, function(a) {
            //       t.attrRange(a);
        });

        t.attrRange({
            row: [0, 1]
        }, {
            align: "center",
            color: "green",
            bg: "black"
        });

        t.attrRange({
            column: [0, 1]
        }, {
            color: "green"
        });

        t.attrRange({
            row: [1],
            column: [1]
        }, {
            leftPadding: 5
        });

        clear();
        console.log("" + t);
    }, Interval);
};
