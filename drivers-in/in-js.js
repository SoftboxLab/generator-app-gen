var fs = require('fs');

module.exports = {
    name: 'JS',

    isValid: function(driver) {
        return driver.config && (typeof driver.config == "string");
    },

    help: function() {
        return '\n\t{ "name": "JS", "config": "filename.js" }';
    },

    read: function (generator, config, callback) {
        var jsFile = generator.destinationPath(config);

        if (!fs.existsSync(jsFile)) {
            callback('File ' + jsFile + ' not found!');
            return;
        }

        var js = require(jsFile);

        js(generator, generator.values, callback);
    }
};
