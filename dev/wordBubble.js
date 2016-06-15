function WordBubble() {

    this.pop = function (configs, target, replace) {

        // cleanup old canvases if necessary
        if (replace && target && target.querySelector) {

            Array.prototype.forEach.call(target.querySelectorAll('canvas.word-bubble'), function (canvas) {
                target.removeChild(canvas);
            });
        }

        var canvases = [].concat(configs).map(function (config) {
            return canvasify(config);
        });

        if (target && target.querySelector) {
            canvases.forEach(function (canvas) {

                target.appendChild(canvas);
                canvas.offsetWidth;
                canvas.classList.add('enter');
            });
        }

        return configs instanceof Array ? canvases : canvases[0];
    };

    function canvasify(cfg) {

        _.defaults(cfg, {
            fill: 'white',
            strokeWidth: 10,
            strokeColor: 'black',
            depth: 10,
            font: 'Helvetica',
            fontSize: 30,
            width: screen.width,
            baselineShift: 0,
            innerStroke: true,
            align: 'center'
        });

        var depth = +cfg.depth;
        var strokeWidth = +cfg.strokeWidth;
        var baselineShift = +cfg.baselineShift;
        var fill;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;
        var font = cfg.fontSize + 'pt ' + cfg.font;
        ctx.font = font;
        var info = split(ctx, cfg.text, cfg.width - strokeWidth * 2 - 10);
        var lines = info.lines;
        var width = cfg.width;
        canvas.width = ratio * width;
        canvas.style.width = width + 'px';
        var lineHeight = +cfg.lineHeight || (+cfg.fontSize + +strokeWidth);
        var height = cfg.height ? cfg.height : lineHeight * lines.length + +strokeWidth * 2 + 20 + depth;
        canvas.height = ratio * height;
        canvas.style.height = height + 'px';
        var padding = (canvas.width - info.widest) / 2;

        if (cfg.fill.colors) {
            fill = ctx.createLinearGradient(padding, height * .1, width - padding, height * .9);
            // Add colors
            cfg.fill.colors.forEach(function (color) {
                fill.addColorStop(color.stop, color.color);
            });
        } else {
            fill = cfg.fill.color || cfg.fill;
        }

        var top = strokeWidth / 2 + depth + 10 + baselineShift;
        var x;
        if(cfg.align === 'right') {
            x = width - strokeWidth - 5;
        } else if(cfg.align === 'left') {
            x = strokeWidth + 5;
        } else {
            x = width / 2;
        }

        var cnt = 0;

        ctx.scale(ratio, ratio);
        ctx.font = font;
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = cfg.strokeColor;
        ctx.textAlign = cfg.align;
        ctx.textBaseline = 'top';
        ctx.lineWidth = strokeWidth * 2;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = cfg.strokeColor;

        for (cnt = 0; cnt < depth; cnt++) {
            lines.forEach(function (line, i) {
                var t = lineHeight * i;
                ctx.fillText(line, x, t + top - cnt + strokeWidth);
                ctx.strokeText(line, x, t + top - cnt + strokeWidth);
            });
        }

        ctx.fillStyle = fill;
        lines.forEach(function (line, i) {
            var t = lineHeight * i;
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            ctx.fillText(line, x, t + top - cnt + strokeWidth);
            if (cfg.innerStroke) {
                ctx.globalAlpha = .75;
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'white';
                ctx.globalCompositeOperation = "soft-light";
                ctx.strokeText(line, x, t + top - cnt + strokeWidth);
            }
        });

        canvas.className = 'word-bubble';
        if (cfg.animation) {
            canvas.classList.add(cfg.animation);
        }
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
