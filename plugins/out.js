module.exports = {

    name: 'OUT',

    isValid: function(config) {
        return true;
    },

    help: function(generator) {
        return 'xxxx';
    },

    write: function(generator, template, out, context) {
        var tplPath = template;

        if (template.indexOf('.') == 0) {
            tplPath = generator.destinationRoot() + '/' + template;
        }

        generator.fs.copyTpl(
            tplPath,

            generator.destinationPath(out),

            context);
    }
};
