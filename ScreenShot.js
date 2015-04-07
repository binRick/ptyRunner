var Pageres = require('pageres');

module.exports = function(Conf, cb) {

    var pageres = new Pageres({
            delay: Conf.delay || 2
        })
        .src(Conf.uri || 'http://google.com', Conf.res || ['480x320', '1024x768', 'iphone 5s'], {
            crop: Conf.crop || false
        })
        .dest(Conf.dest || __dirname);

    pageres.on('warn', function(A, B) {
        console.log('WARN!!!', A, B);

    });

    pageres.run(cb);

};