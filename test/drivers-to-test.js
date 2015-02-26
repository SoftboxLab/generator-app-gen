var assert = require("assert");

var file    = require("../drivers-to/to-file.js");
var console = require("../drivers-to/to-console.js");

describe('Plugins', function() {
    describe('FILE', function() {
        describe('#name', function() {
            it('should return FILE', function() {
                assert.equal('FILE', file.name);
            });
        });

        describe('#help', function() {
            it('should return help', function() {
                assert.equal('{ type: "FILE", out: "file path to output" }', file.help());
            });
        });

        describe('#isValid', function() {
            it('should return valid', function() {
                assert.strictEqual(true, file.isValid({
                    out: 'xxx',
                }));
            });

            it('should return invalid', function() {
                assert.strictEqual(false, file.isValid(null));
                assert.strictEqual(false, file.isValid({
                    template: 'bbb'
                }));
            });
        });

        describe('#to', function() {
            it('should write text on output file', function() {
                var ctxSample = {
                    key: 'value'
                };
                var generatorMock = {
                    destinationRoot: function() {
                        return '/tmp';
                    },

                    destinationPath: function(path) {
                        return path;
                    },

                    values: {
                        foo: 'bar'
                    },

                    fs: {
                        write: function(path, text) {
                            assert.equal('./mock/bar', path);
                            assert.equal('hello world!', text);
                        }
                    }
                };


                file.to(generatorMock, 'hello world!', {out: './mock/<%=foo%>'});
            });
        });
    });



    describe('CONSOLE', function() {
        describe('#name', function() {
            it('should return CONSOLE', function() {
                assert.equal('CONSOLE', console.name);
            });
        });

        describe('#help', function() {
            it('should return help', function() {
                assert.equal('{ type: "CONSOLE" }', console.help());
            });
        });

        describe('#isValid', function() {
            it('should return valid', function() {
                assert.strictEqual(true, console.isValid(null));
            });
        });

        describe('#to', function() {
            it('should write text on console', function() {
                var ctxSample = {
                    key: 'value'
                };
                var log = '';

                var generatorMock = {
                    destinationRoot: function() {
                        return '/tmp';
                    },
                    destinationPath: function(path) {
                        return path;
                    },
                    values: {
                        foo: 'bar'
                    },
                    log: function(str) {
                        log += str;
                    },
                    fs: {
                        read: function() {
                            return '<%=key%>';
                        }
                    }
                };

                console.to(generatorMock, 'hello world!', null);

                assert.equal(true, log.indexOf('hello world') !== -1);
            });
        });
    });
});
