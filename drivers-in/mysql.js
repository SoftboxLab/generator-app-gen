var mysql = require('mysql');
var merge = require('merge');
var _ = require('underscore');


function query(config, callback) {
    var connection = mysql.createConnection({
        host: config.host || 'localhost',
        user: config.user || 'root',
        password: config.password || 'root',
        database: config.database || null
    });

    connection.connect();

    connection.query(config.query || 'SELECT null', function(err, rows, fields) {
        if (err) {
            callback(err, null);
            return;
        }

        //console.dir(rows);

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
