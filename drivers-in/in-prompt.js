module.exports = {
    name: 'PROMPT',

    read: function(generator, config, callback) {
        config.forEach(function(elem) {
            elem.type = elem.type || 'input';
        });

        generator.prompt(config, function(answers) {
            callback(null, Object.assign({}, generator.values, answers));
        });
    }
};
