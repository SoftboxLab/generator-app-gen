var mysql = require('mysql');
var merge = require('merge');
var _ = require('underscore');


function query(config, callback) {
    var connection = mysql.createConnection({
        host: config.host || 'localhost',
        user: config.user || 'root',
        port: config.port || 3306,
        password: config.password || 'root',
        database: config.database || null
    });

    connection.connect();

    connection.query(config.query || 'SELECT null', function(err, rows) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, {rows: rows});
    });

    connection.end();
}


module.exports = {
    name: 'MYSQL',

    read: function(generator, config, callback) {
        var configCopy = merge({}, generator.values, config || {});

        if (configCopy.query) {
            configCopy.query = _.template(config.query)(configCopy);
        }

        query(configCopy, callback);
    }
};
