var assert = require("assert");

var json   = require("../drivers-in/json.js");
var prompt = require("../drivers-in/prompt.js");

var proxyquire = require('proxyquire');


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

                json.read(null, config, function(err, cfg) {
                    assert.equal(null, err);
                    assert.equal(config, cfg);

                    done();
                });
            });
        });
    });

    describe('MYSQL', function() {
        var mysql = null;

        before(function() {
            mysql = proxyquire('../drivers-in/mysql', {
              'mysql': {
                  createConnection: function() {
                      return {
                          connect: function() {
                          },

                          query: function(query, callback) {
                              if (query == 'err') {
                                  callback('err', null);
                                  return;
                              }

                              assert.equal('select bar as ret', query);

                              callback(null, [{
                                      id: 1,
                                      value: 'one'
                                  }, {
                                      id: 2,
                                      value: 'two'
                                  }
                              ]);
                          },

                          end: function() {
                          }
                      };
                  }
              }
            });
        });

        describe('#name', function() {
            it('should return MYSQL', function() {
                assert.equal('MYSQL', mysql.name);
            });
        });

        describe('#read', function() {
            it('should execute template, perform mysql query and return the resultset on property rows', function(done) {
                var config = {
                    query: 'select <%=foo%> as ret'
                };

                var generator = {values: {foo: 'bar'}};

                mysql.read(generator, config, function(err, values) {
                    assert.strictEqual(null, err);
                    assert.notEqual(null, values);
                    assert.notEqual(null, values.rows);
                    assert.equal(2, values.rows.length);

                    done();
                });
            });

            it('should return error message and return null on values', function(done) {
                var config = {
                    query: 'err'
                };

                var generator = {values: {foo: 'bar'}};
                //
                mysql.read(generator, config, function(err, values) {
                    assert.strictEqual(null, values);
                    assert.equal('err', err);

                    done();
                });
            });
        });
    });
});
