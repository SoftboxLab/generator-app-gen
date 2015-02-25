var assert = require("assert");

var file = require("../plugins/file.js");
var console = require("../plugins/console.js");

describe('Plugins', function() {
    describe('FILE', function() {
        describe('#name', function() {
            it('should return FILE', function() {
                assert.equal('FILE', file.name);
            });
        });

        describe('#help', function() {
            it('should return help', function() {
                assert.equal('{ type: "FILE", template: "template file path", out: "file path to output" }', file.help());
            });
        });

        describe('#isValid', function() {
            it('should return valid', function() {
                assert.strictEqual(true, file.isValid({
                    out: 'xxx',
                    template: 'yyy'
                }));
            });

            it('should return invalid', function() {
                assert.strictEqual(false, file.isValid(null));
                assert.strictEqual(false, file.isValid({
                    out: 'aaa'
                }));
                assert.strictEqual(false, file.isValid({
                    template: 'bbb'
                }));
            });
        });

        describe('#write', function() {
            it('should match bindings on template and write the output file', function() {
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
                        copyTpl: function(tpl, out, ctx) {
                            assert.equal('/tmp/./mock/xxx', tpl);
                            assert.equal('/out/bar', out);
                            assert.equal(ctxSample, ctx);
                        }
                    }
                };


                file.write(generatorMock, './mock/xxx', '/out/<%=foo%>', ctxSample);
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
                assert.equal('{ type: "CONSOLE", template: "template file path" }', console.help());
            });
        });

        describe('#isValid', function() {
            it('should return valid', function() {
                assert.strictEqual(true, console.isValid({
                    template: 'yyy'
                }));
            });

            it('should return invalid', function() {
                assert.strictEqual(false, console.isValid(null));
                assert.strictEqual(false, console.isValid({
                    out: 'aaa'
                }));
            });
        });

        describe('#write', function() {
            it('should match bindings on template and write the output file', function() {
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

                console.write(generatorMock, './mock/xxx', null, ctxSample);

                assert.equal(true, log.indexOf('value') !== -1);
            });
        });
    });
});
