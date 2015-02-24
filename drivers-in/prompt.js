var async = require('async');
var merge = require('merge');

function prompt(generator, config, next) {
    generator.log();
    generator.prompt({
        type: config.type || 'input',
        name: config.name,
        message: config.message,
        choices: config.choices
    }, function(answers) {
        next(null, answers);
    });
}

module.exports = {
    name: 'PROMPT',

    read: function(generator, config, callback) {
        async.mapSeries(config, prompt.bind(this, generator), function(err, results) {
            callback(null, merge.apply(null, results));
        });
    }
};
