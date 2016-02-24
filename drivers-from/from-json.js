module.exports = {
    name: 'JSON',

    isValid: function(config) {
        return !!(config && config.template);
    },

    help: function() {
        return '{ driver: "JSON", template: "template string" }';
    },

    from: function(generator, config) {
        return config.template;
    }
};
