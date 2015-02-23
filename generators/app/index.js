var generators = require('yeoman-generator');
var fs = require('fs');
var Q  = require('q');
var async = require('async');

var plugins = {
    'FILE': require('../../plugins/file.js'),
    'OUT': require('../../plugins/out.js')
};

var driversIn = {
    'JSON': require('../../drivers-in/json.js'),
    'PROMPT': require('../../drivers-in/prompt.js')
};

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
        console.log(next);

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
        this.plugin.write(this, this.artifact.template, this.artifact.out, this.values);
    }
});
