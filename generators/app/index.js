var generators = require('yeoman-generator');
var fs    = require('fs');
var async = require('async');
var path  = require('path');
var chalk = require('chalk');
var merge = require('merge');
var _     = require('lodash');

var drivers = {
    from: {},
    to: {},
    in: {}
};

var APPGEN_CONFIG = 'app-gen';

module.exports = generators.Base.extend({
    /**
     * Load de drivers (in, to, from) modules.
     */
    _loadModules: function(moduleDir, cache) {
        var dir = path.join(__dirname, moduleDir);

        fs.readdirSync(dir).forEach(function(fileName) {
            var file = dir + fileName;

            if (!fs.statSync(file).isFile()) {
                return;
            }

            var module = require(file);

            cache[module.name] = module;
        });
    },

    _getAppGenFile: function(ext) {
        var appgenFile = this.destinationRoot() + '/' + APPGEN_CONFIG + ext;

        if (!fs.existsSync(appgenFile)) {
            return false;
        }

        return appgenFile;
    },

    _load: function() {
        var appgenFile = this._getAppGenFile('.json') || this._getAppGenFile('.js');

        if (appgenFile === false) {
            this.log('The configuration file \'' + APPGEN_CONFIG + '.[json|js]\' does not exists!');
            process.exit(1);
            return;
        }

        this.appgen = require(appgenFile);
    },

    _printDriver: function(driver, msg) {
        this.log('\n' + chalk.white.bold(msg));

        Object.keys(driver).forEach(function(elem) {
            this.log('   ' + chalk.green.bold('> ' + elem));
        }.bind(this));
    },

    initializing: function() {
        this._loadModules('../../drivers-from/', drivers.from);
        this._loadModules('../../drivers-in/'  , drivers.in);
        this._loadModules('../../drivers-to/'  , drivers.to);

        this.log('\n' + chalk.yellow.bold(fs.readFileSync(path.join(__dirname, '../../logo.txt'), 'utf8')));

        this._printDriver(drivers.from, '## Drivers - From ##');
        this._printDriver(drivers.in,   '## Drivers - In ##');
        this._printDriver(drivers.to,   '## Drivers - To ##');

        this._load();
    },

    _selectArtifact: function(next) {
        this.log();

        this.prompt({
            type: 'list',
            name: 'artifactName',
            message: 'Choose the artifact',
            choices: Object.keys(this.appgen.artifacts)
        }, function(answers) {
            this.artifactName = answers.artifactName;

            next(null);
        }.bind(this));
    },

    _loadHelpers: function (next) {

        this.helper = this.appgen.helper;

        var helpers = {};

        for (var i in this.helper) {
            if (this.helper.hasOwnProperty(i)) {
                merge(helpers, {[i] : require(this.destinationRoot() + '/' + this.helper[i])});
            }
        }

        this.values._helpers = helpers;

        next(null);
    },

    _loadArtifact: function(next) {
        this.artifact = this.appgen.artifacts[this.artifactName];

        if (!this.artifact) {
            this.log('The artifact selected does not exists: ' + this.artifactName);
            process.exit(1);
            return;
        }

        if (!this.artifact.in || !this.artifact.from || !this.artifact.to) {
            this.log('The artifact must be compound of properties: from, in and out.');
            process.exit(1);
            return;
        }

        next(null);
    },

    _loadDriver: function(type, cache, config) {
        if (!config) {
            this.log('Driver (' + type + ') configuration not supplied!');
            process.exit(1);
            return;
        }

        if (!config.driver) {
            this.log('Driver (' + type + ') name not supplied!');
            process.exit(1);
            return;
        }

        var driver = cache[config.driver];

        if (!driver) {
            this.log('Driver (' + type + ') not found: ' + config.driver);
            process.exit(1);
            return;
        }

        if (driver.isValid && !driver.isValid(config)) {
            this.log('The configurations supplied for driver ' + config.driver +
                    ' (' + type + ') are invalid!' + (driver.help ? '\n\nUsage: ' +
                    driver.help() + '\n\n': ''));
            process.exit(1);
            return;
        }

        this.drivers[type] = driver;
    },

    _loadDrivers: function(next) {
        this.drivers = {from: null, to: null, in: null};
        next(null);
    },

    _getValues: function(driverIn, next) {
        this._loadDriver('in', drivers.in, driverIn);

        this.drivers.in.read(this, driverIn.config || {}, function(err, values) {
            if (err) {
              this.log("Error executing IN driver: ", err);
            }
            this.values = merge(this.values, values || {});

            next(null);
        }.bind(this));
    },

    _readInputs: function(next) {
        //this.values = {};

        if (this.artifact.in.constructor === Array) {
            async.mapSeries(this.artifact.in, this._getValues.bind(this), function(err, result) {
                next(null);
            });

            return;
        }

        this._getValues(this.artifact.in, next);
    },

    prompting: function() {
        var done = this.async();

        this.values = {};

        async.waterfall([
            this._loadHelpers.bind(this),
            this._selectArtifact.bind(this),
            this._loadArtifact.bind(this),
            this._loadDrivers.bind(this),
            this._readInputs.bind(this)
        ], function(err, result) {
            done();

        }.bind(this));
    },

    _writeTo: function(text, driverTo, i) {

        this._loadDriver('to', drivers.to, driverTo);

        this.drivers.to.to(this, text, driverTo, i);
    },

    writing: function() {
        this.log();

        this._loadDriver('from', drivers.from, this.artifact.from);

        var template = this.drivers.from.from(this, this.artifact.from);
        var _this = this;

        var to = this.artifact.to;

        if (this.artifact.to.constructor !== Array) {
           to = [this.artifact.to];
        }

        template.forEach(function(value, index){
          var text = _.template(value)(_this.values);
          var i = index;
          to.forEach(function(v){
            _this._writeTo(text, v, i);
          });
        });
    }
});
