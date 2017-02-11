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

      var path = generator.destinationPath(_.template(config.out[index])(generator.values));

      if (config.replace) {
        var regExp = config.replace.regex || '';

        var flags = config.replace.flags || 'g';

        var txtFile = generator.fs.read(path);

        text = txtFile.replace(new RegExp(regExp, flags), text);
      } 

      generator.fs.write(path, text);
    }
};
