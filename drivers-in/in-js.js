var fs = require('fs');

module.exports = {
    name: 'JS',

    isValid: function(driver) {
        return driver.config && (typeof driver.config == "object") 
            && typeof driver.config.filename == "string";
    },

    help: function() {
        return '\n\t{ "name": "JS", "config": { "filename": "filename.js" } }';
    },

    read: function (generator, config, callback) {
        var jsFile = generator.destinationPath(config.filename);

        if (!fs.existsSync(jsFile)) {
            callback('File ' + jsFile + ' not found!');
            return;
        }

        var js = require(jsFile);

        js(generator, generator.values, function(err, values) {
            callback(err, Object.assign({}, generator.values, values || {}));
        });
    }
};
