var bubbler = new WordBubble();
var input = document.getElementById('input');
var target = document.getElementById('target');
var replace = document.getElementById('replace');

var customOpts = ['strokeColor', 'strokeWidth', 'depth', 'animation', 'font', 'baselineShift', 'lineHeight', 'fontSize'];

function pop(multi) {

    var options = {
        font: 'Pusab',
        fill: {
            colors: [
                {stop: 0, color: 'rgba(106, 196, 157, 1.000)'},
                {stop: .5, color: 'rgba(232, 113, 113, 1.000)'},
                {stop: 1, color: 'rgba(247, 145, 49, 1.000)'}
            ]
        }
    };

    customOpts.forEach(function(name) {
        var opt = document.getElementById(name);
        if (opt && opt.value) {
            options[name] = opt.value;
        }
    });

    if (multi) {
        bubbler.pop(input.value.split(/\n/).map(function (line, i) {
            options.animation = i % 2 ? 'from-left' : 'from-right';
            return genConfig(line, options);
        }), target, replace.checked);
    } else {
        bubbler.pop(genConfig(input.value, options), target, replace.checked);
    }
}

function genConfig(text, options) {

    return _.merge({
        text: text
    }, options);
}

function clearMessages() {
    target.innerHTML = '';
}