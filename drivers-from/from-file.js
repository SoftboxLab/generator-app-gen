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

        if (config.template.indexOf('.') === 0) {
            tplPath = generator.destinationRoot() + '/' + config.template;
        }

        return generator.fs.read(tplPath);
    }
};
