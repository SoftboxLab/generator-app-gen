var _ = require('lodash');

module.exports = {

    name: 'FILE',

    isValid: function(config) {
        return !!(config && config.out);
    },

    help: function() {
        return '{ type: "FILE", out: "file path to output" }';
    },

    to: function(generator, text, config, index) {
      var configs = [];

      if(!Array.isArray(config.out)){
        config.out = [config.out];
      }

      generator.fs.write(generator.destinationPath(_.template(config.out[index])(generator.values)), text);
    }
};
