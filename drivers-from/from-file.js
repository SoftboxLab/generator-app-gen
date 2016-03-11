module.exports = {
    name: 'FILE',

    isValid: function(config) {
        return !!(config && config.template);
    },

    help: function() {
        return '{ driver: "FILE", template: "template file path" }';
    },

    from: function(generator, config) {
        var tplPath = config.template;
        var templates = [];

        if(!Array.isArray(tplPath)){
          tplPath = [config.template];
        };

        tplPath.forEach(function(value) {
          if (value.indexOf('.') === 0) {
              value = generator.destinationRoot() + '/' + value;
          }

          templates.push(generator.fs.read(value));
        });

        return templates
    }
};
