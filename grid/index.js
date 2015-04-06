var Canvas = require('term-canvas'),
    _ = require('underscore'),
    size = process.stdout.getWindowSize(),
    Package = require('./package'),
    Grid = require('./grid');

module.exports = function(Conf) {

    Conf.Items = Conf.Items || ['demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3', 'demoItem', 'demoItem1', 'demoItem3'];
    Conf.Items = Conf.Items || ['demoItem', 'demoItem1', 'demoItem3'];
    Conf.Items = Conf.Items || ['demoItem', 'demoItem1', 'demoItem3'];
    Conf.States = Conf.States || ['downloading', 'unpacking', 'preinstall', 'postinstall', 'link', 'complete'];

    process.on('SIGINT', function() {
        ctx.reset();
        process.nextTick(function() {
            process.exit();
        });
    });

    process.on('SIGWINCH', function() {
        size = process.stdout.getWindowSize();
        canvas.width = size[0];
        canvas.height = size[1];
        grid = grid.clone();
    });

    var canvas = new Canvas(size[0], size[1]),
        ctx = canvas.getContext('2d'),
        grid = new Grid(canvas);

    _.each(Conf.Items, function(i) {
        grid.add(new Package(i));
    });
    ctx.hideCursor();
    setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.draw(ctx);
    }, 1000 / 20);

    // faux progress

    var total = Conf.States.length;

    grid.objs.forEach(function(obj) {
        obj.curr = 0;

        function update() {
            var state = Conf.States[obj.curr++];
            if (!state) return;
            obj.text(state).complete(obj.curr / total);
            setTimeout(update, Math.random() * 800);
        }

        update();
    });

};
