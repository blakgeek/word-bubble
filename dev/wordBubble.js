function WordBubble() {

    this.pop = function (configs, target, replace) {

        var canvases = [].concat(configs).map(function(config) {
            return canvasify(config);
        }).forEach(function(canvas) {


            if (target && target.querySelector) {
                var oldCanvas = target.querySelector('canvas.word-bubble');

                if (replace === true && oldCanvas) {
                    target.replaceChild(canvas, oldCanvas);
                } else {
                    target.appendChild(canvas);
                }
                canvas.offsetWidth;
                canvas.classList.add('enter');
            }
        })
    };

    function canvasify(cfg) {

        _.defaults(cfg, {
            fill:  'white',
            strokeWidth: 10,
            strokeColor: 'black',
            depth: 10,
            font: 'Helvetica',
            fontSize: 30,
            width: 800,
            animation: 'pop-in',
            baselineShift: 0
        });

        var depth = +cfg.depth;
        var strokeWidth = +cfg.strokeWidth;
        var baselineShift = +cfg.baselineShift;
        var fill;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        var font = cfg.fontSize + 'pt ' + cfg.font;
        ctx.font = font;
        var info = split(ctx, cfg.text, cfg.width - strokeWidth * 2 - 10);
        var lines = info.lines;
        canvas.width = cfg.width;
        var lineHeight = +cfg.lineHeight || (+cfg.fontSize + +strokeWidth);
        canvas.height = lineHeight * lines.length + +strokeWidth * 2 + 20 + depth;
        var padding = (canvas.width - info.widest) / 2;

        if (cfg.fill.colors) {
            fill = ctx.createLinearGradient(padding, canvas.height * .1, canvas.width - padding, canvas.height * .9);
            // Add colors
            cfg.fill.colors.forEach(function (color) {

                fill.addColorStop(color.stop, color.color);
            });
        } else {
            fill = cfg.fill.color || cfg.fill;
        }

        var top = strokeWidth / 2 + depth + 10 + baselineShift;
        var center = cfg.width / 2;

        var cnt = 0;

        ctx.font = font;
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = cfg.strokeColor;
        ctx.textAlign = "center";
        ctx.textBaseline = 'top';
        ctx.lineWidth = strokeWidth * 2;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = cfg.strokeColor;

        for (cnt = 0; cnt < depth; cnt++) {
            lines.forEach(function (line, i) {
                var t = lineHeight * i;
                ctx.fillText(line, center, t + top - cnt + strokeWidth);
                ctx.strokeText(line, center, t + top - cnt + strokeWidth);
            });
        }

        ctx.fillStyle = fill;
        lines.forEach(function (line, i) {
            var t = lineHeight * i;
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            ctx.fillText(line, center, t + top - cnt + strokeWidth);
            ctx.globalAlpha = .75;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.globalCompositeOperation = "soft-light";
            ctx.strokeText(line, center, t + top - cnt + strokeWidth);
        });

        canvas.className = 'word-bubble';
        canvas.classList.add(cfg.animation);
        return canvas;
    }

    function split(ctx, text, maxWidth) {

        var lines = text.split("\n");
        var result = [];
        var widest = 0;

        for (var i = 0; i < lines.length; i++) {

            var words = lines[i].split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine.trim());
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    result.push(line.trim());
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                    widest = Math.max(widest, testWidth);
                }
            }

            result.push(line.trim());
        }

        return {
            lines: result,
            widest: widest
        };
    }
}
