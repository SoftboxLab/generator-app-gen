module.exports = {
    name: 'JSON',

    isValid: function(driver) {
        return driver.config && typeof driver.config == "object";

        return false;
    },

    help: function() {
        return '\n\t{ "name": "JSON", "config": { "key1" : "value1", "key2": "value2" } }';
    },

    read: function(generator, config, callback) {
        callback(null, Object.assign({}, generator.values, config));
    }
};
