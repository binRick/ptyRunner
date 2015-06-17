#!/usr/bin/env node
var Prompts = require('machinepack-prompts');

Prompts.text({
    message: 'login as: ',
    protect: false,
    expectJson: false,
}).exec({
    error: function(err) {

    },
    success: function(result) {
        console.log('This system is for authorized use only.');
        var t = 'admin@10.230.130.37\'s password:';
        Prompts.text({
            message: t,
            protect: true,
            expectJson: false,
        }).exec({
            error: function(err) {

            },
            success: function(result) {
                var t = 'Last login: Wed Apr 15 13:05:44 2015 from 10.230.100.103';
                console.log(t);
                t = 'PHXHWYN009> ';
                Prompts.text({
                    message: t,
                    protect: false,
                    expectJson: false,
                }).exec({
                    error: function(err) {

                    },
                    success: function(result) {
                        var t = 'This is Check Point VPN-1(TM) & FireWall-1(R) R76 - Build 380';
                        console.log(t);
                    },
                });
            },
        });
    },
});
