var _ = require('lodash');

module.exports = {

    name: 'CONSOLE',

    isValid: function(config) {
        return !!(config && config.template);
    },

    help: function() {
        return '{ type: "CONSOLE", template: "template file path" }';
    },

    write: function(generator, template, out, context) {
        var tplPath = template;

        if (template.indexOf('.') === 0) {
            tplPath = generator.destinationRoot() + '/' + template;
        }

        generator.log('------------- OUT -------------');
        generator.log(_.template(generator.fs.read(tplPath))(context));
        generator.log('------------- END -------------');
    }
};
