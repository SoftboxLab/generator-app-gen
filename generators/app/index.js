var generators = require('yeoman-generator');
var fs    = require('fs');
var async = require('async');
var path  = require('path');
var chalk = require('chalk');
var merge = require('merge');

var plugins   = {};
var driversIn = {};

function loadModules(moduleDir, cache) {
    var dir = path.join(__dirname, moduleDir);

    fs.readdirSync(dir).forEach(function(fileName) {
        var file = dir + fileName;

        if (!fs.statSync(file).isFile()) {
            return;
        }

        var module = require(file);

        cache[module.name] = module;
    });
}

var APPGEN_CONFIG = 'app-gen';

module.exports = generators.Base.extend({
    _getAppGenFile: function(ext) {
        var appgenFile = this.destinationRoot() + '/' + APPGEN_CONFIG + ext;

        if (!fs.existsSync(appgenFile)) {
            return false;
        }

        return appgenFile
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

    _loadPlugin: function(next) {
        this.artifact = this.appgen.artifacts[this.artifactName];

        this.plugin = plugins[this.artifact.type];

        if (!this.plugin) {
            this.log('The plugin "' + this.artifact.type + '" not exists or not loaded!');
            process.exit(1);
            return;
        }

        if (this.plugin.isValid && this.plugin.isValid(this.artifact) !== true) {
            this.log('The supplied configs for artifact ' + artifactName + ' are incomplete.\n');
            this.log('Type: ' + plugin.name + '.\n');

            if (plugin.help) {
                this.log('Usage: \n\n' + plugin.help(this) + '\n\n');
            }

            process.exit(1);
            return;
        }

        next(null);
    },

    _readInputs: function(driverIn, next) {
        if (!driverIn) {
            next('Driver not supplied!', null);
            return;
        }

        this.driverIn = driversIn[driverIn.driver];

        if (!this.driverIn) {
            next('Driver not found: ' + driverIn.driver, null);
            return;
        }

        this.driverIn.read(this, driverIn.config || {}, function(err, values) {
            this.values = merge(this.values || {} , values || {});

            next(null);
        }.bind(this));
    },

    _loadDriver: function(next) {
        if (this.artifact.in.constructor === Array) {
            async.mapSeries(this.artifact.in, this._readInputs.bind(this), function(err, result) {
                next(null);
            });

            return;
        }

        this._readInputs(this.artifact.in, next);
    },

    initializing: function() {
        loadModules('../../plugins/'   , plugins);
        loadModules('../../drivers-in/', driversIn);

        this.log('\n' + chalk.yellow.bold(fs.readFileSync(path.join(__dirname, '../../logo.txt'), 'utf8')));

        this.log('\n' + chalk.white.bold('## Plugins ##'));
        Object.keys(plugins).forEach(function(elem) {
            this.log('   ' + chalk.green.bold('> ' + elem));
        }.bind(this));

        this.log('\n' + chalk.white.bold('## In Drivers ##'));
        Object.keys(driversIn).forEach(function(elem) {
            this.log('   ' + chalk.cyan.bold('> ' + elem));
        }.bind(this));

        this._load();
    },

    prompting: function() {
        var done = this.async();

        async.waterfall([
            this._selectArtifact.bind(this),
            this._loadPlugin.bind(this),
            this._loadDriver.bind(this)
        ], function(err, result) {
            //console.dir(this.values);

            done();
        }.bind(this));
    },

    writing: function() {
        this.log();

        this.plugin.write(this, this.artifact.template, this.artifact.out, this.values);
    }
});
