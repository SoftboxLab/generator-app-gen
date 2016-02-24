var _ = require('lodash');

module.exports = {

    name: 'CONSOLE',

    isValid: function(config) {
        return true;
    },

    help: function() {
        return '{ type: "CONSOLE" }';
    },

    to: function(generator, text) {
        generator.log('------------- OUT -------------');
        generator.log(text);
        generator.log('------------- END -------------');
    }
};
