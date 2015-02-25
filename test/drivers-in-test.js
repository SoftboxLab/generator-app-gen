var assert = require("assert");

var json = require("../drivers-in/json.js");

describe('Drivers-In', function() {
    describe('JSON', function() {
        describe('#name', function() {
            it('should return JSON', function() {
                assert.equal('JSON', json.name);
            });
        });

        describe('#read', function() {
            it('should return the same supplied object on config argument', function(done) {
                var config = {
                    foo: 'bar'
                };

                config, json.read(null, config, function(err, cfg) {
                    assert.equal(null, err);
                    assert.equal(config, cfg);

                    done();
                });
            });
        });
    });
});
