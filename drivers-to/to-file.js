var _ = require('lodash');

module.exports = {

    name: 'FILE',

    isValid: function(config) {
        return !!(config && config.out);
    },

    help: function() {
        return '{ type: "FILE", out: "file path to output" }';
    },

    to: function(generator, text, config) {
        generator.fs.write(generator.destinationPath(_.template(config.out)(generator.values)), text);
    }
};
