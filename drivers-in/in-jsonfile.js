module.exports = {
    name: 'JSONFILE',

    isValid: function(driver) {
        return driver.config 
            && (typeof driver.config == "string" 
                || 
                (typeof driver.config == "object" && driver.config.length)
               );

        return false;
    },

    help: function() {
        return '\n\t{ "name": "JSONFILE", "config": "filename.json" }\n\n\tOR\n\n\t{ "name": "JSONFILE", "config": ["filename1.json", "filename2.json", ...] }';
    },

    read: function (generator, config, callback) {
        if (typeof config == "string") {
            config = require(generator.destinationPath(config));

        } else {
            var binds = {};

            config.forEach(function(ele) {
                Object.assign(binds, require(generator.destinationPath(ele)));
            });

            config = binds;
        }

        callback(null, config);
    }
};
