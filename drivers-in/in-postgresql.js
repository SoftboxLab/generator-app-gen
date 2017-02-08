var pg = require('pg');
var merge = require('merge');
var _ = require('underscore');

function query(config, callback) {

    var client = new pg.Client({
        user: config.user || 'postgres', //env var: PGUSER
        database: config.database || 'postgres', //env var: PGDATABASE
        password: config.password || 'postgres', //env var: PGPASSWORD
        host: config.host || 'localhost', // Server hosting the postgres database
        port: config.port || 5432 //env var: PGPORT
    });

    client.connect(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        client.query(config.query || 'SELECT 1 numero', function(err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, {
                rows: result.rows
            });
            client.end(function(err) {
                if (err) throw err;
            });
        });
    });
}


module.exports = {
    name: 'POSTGRESQL',

    read: function(generator, config, callback) {
        var configCopy = merge({}, generator.values, config || {});

        if (configCopy.query) {
            configCopy.query = _.template(config.query)(configCopy);
        }

        query(configCopy, callback);
    }
};
