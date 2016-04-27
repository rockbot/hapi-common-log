var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    beforeEach = lab.beforeEach,
    it = lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    Boom = require('boom'),
    toCommonLogFormat = require('../'),
    server;

function createServer(done) {

  server = Hapi.createServer();

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply(200);
    }
  });

  server.route({
    method: 'GET',
    path: '/error',
    handler: function (request, reply) {
      reply(Boom.notFound());
    }
  });

  done();
}

describe('common log format', function () {
  beforeEach(createServer);

  it('comes through as expected', function (done) {

    server.ext('onPostHandler', function (request, next) {
      var clf = toCommonLogFormat(request);

      var components = clf.split('"');

      var now = new Date();
      var date = now.toDateString().split(' ');
      // [ 'Tue',
      //   'Dec',
      //   '30',
      //   '2014' ]

      var time = now.toTimeString().split(' ');
      // [ '11:52:54', 'GMT-0800', '(PST)' ]


      // '%d/%b/%Y:%H:%M:%S %z'
      var expectedDate = date[2] + '/' + date[1] + '/' + date[3] + ':';
      var expectedTime = time[0] + ' ' + time[1].slice(3);

      expect(components[0]).to.include('[' + expectedDate + expectedTime + ']');
      expect(components[1]).to.equal('GET / HTTP/1.1');
      expect(components[2]).to.equal(' 200 -');

      next();
    });

    server.inject({url: '/'}, function () {
      done();
    });
  });

  it('handles Boom errors', function (done) {

    server.ext('onPostHandler', function (request, next) {
      var clf = toCommonLogFormat(request);

      var components = clf.split('"');

      var now = new Date();
      var date = now.toDateString().split(' ');
      // [ 'Tue',
      //   'Dec',
      //   '30',
      //   '2014' ]

      var time = now.toTimeString().split(' ');
      // [ '11:52:54', 'GMT-0800', '(PST)' ]


      // '%d/%b/%Y:%H:%M:%S %z'
      var expectedDate = date[2] + '/' + date[1] + '/' + date[3] + ':';
      var expectedTime = time[0] + ' ' + time[1].slice(3);

      expect(components[0]).to.include('[' + expectedDate + expectedTime + ']');
      expect(components[1]).to.equal('GET /error HTTP/1.1');
      expect(components[2]).to.equal(' 404 -');

      next();
    });

    server.inject({url: '/error'}, function () {
      done();
    });
  });
});

describe('handling options', function () {
  beforeEach(createServer);

  it('looks up IP from the header if desired', function (done) {
    server.ext('onRequest', function (request, next) {
      request.headers['x-forwarded-to'] = '123.45.678';
      next();
    });

    server.ext('onPostHandler', function (request, next) {
      var clf = toCommonLogFormat(request, {ipHeader: 'x-forwarded-to'});
      var components = clf.split(' ');

      expect(components[0]).to.equal('123.45.678');

      next();
    });

    server.inject({url: '/'}, function () {
      done();
    });
  });
});