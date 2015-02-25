var _ = require('lodash');

module.exports = {

    name: 'FILE',

    isValid: function(config) {
        return true;
    },

    help: function(generator) {
        return 'xxxx';
    },

    write: function(generator, template, out, context) {
        var tplPath = template;

        if (template.indexOf('.') === 0) {
            tplPath = generator.destinationRoot() + '/' + template;
        }

        console.log('>>>', _.template(out)(generator.values));

        generator.fs.copyTpl(
            tplPath,

            generator.destinationPath(_.template(out)(generator.values)),

            context);
    }
};
