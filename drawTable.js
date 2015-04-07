#!/usr/bin/env node

var Tabular = require('./Tabular');

var Cols = ["", "Application", "User", "Service", "Process", "Status"];
var Attrs = [];
Attrs.push({
    row: [0, 1]
}, {
    align: "center",
    color: "green",
    bg: "black"
});

var Rows = [];
Rows.push(["✓", "Arma3Server", "arma3server", "tty.js", "xxxx", "xxx"]);
//Rows.push(["x", "Arma3Server", "arma3server", "tty.js", "xxxx", "xxx"]);

Tabular(Cols, Rows, Attrs, 3000);
