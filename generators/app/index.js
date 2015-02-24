var generators = require('yeoman-generator');
var fs    = require('fs');
var async = require('async');
var path  = require('path');
var chalk = require('chalk');

var plugins   = {};
var driversIn = {};

function loadModules(dir, cache) {
    var dir = path.join(__dirname, dir);

    fs.readdirSync(dir).forEach(function(file) {
        var file = dir + file;

        if (!fs.statSync(file).isFile()) {
            return;
        }

        var module = require(file);

        cache[module.name] = module;
    });
}

loadModules('../../plugins/'   , plugins);
loadModules('../../drivers-in/', driversIn);

console.log('\n' + chalk.yellow.bold(fs.readFileSync(path.join(__dirname, '../../logo.txt'), 'utf8')));

console.log('\n' + chalk.white.bold('## Plugins ##'));
Object.keys(plugins).forEach(function(elem) {
    console.log('   ' + chalk.green.bold('> ' + elem));
});

console.log('\n' + chalk.white.bold('## In Drivers ##'));
Object.keys(driversIn).forEach(function(elem) {
    console.log('   ' + chalk.cyan.bold('> ' + elem));
});

var APPGEN_CONFIG = 'app-gen.json';

module.exports = generators.Base.extend({
    _load: function() {
        var appgenFile = this.destinationRoot() + '/' + APPGEN_CONFIG;

        if (!fs.existsSync(appgenFile)) {
            this.log('The configuration file \'' + APPGEN_CONFIG + '\' does not exists!');
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

    _loadDriver: function(next) {
        this.driverIn = driversIn[this.artifact.in.driver];

        this.driverIn.read(this, this.artifact.in.config || {}, function(err, values) {
            this.values = values;

            next(null);
        }.bind(this));
    },

    prompting: function() {
        this._load();

        var done = this.async();

        var that = this;

        async.waterfall([
            this._selectArtifact.bind(this),
            this._loadPlugin.bind(this),
            this._loadDriver.bind(this)
        ], function(err, result) {
            done();
        });
    },

    writing: function() {
        this.log();

        this.plugin.write(this, this.artifact.template, this.artifact.out, this.values);
    }
});
