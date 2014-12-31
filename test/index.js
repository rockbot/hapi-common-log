var Code = require('code');;
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var Hapi = require('hapi');
var server = new Hapi.Server();

var server1 = server.connection({
  host: 'localhost',
  port: '8080'
});

var server2 = server.connection({
  host: 'localhost',
  port: '8081'
});

var routes = {
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply(200);
  }
};


server1.route(routes);
server2.route(routes);

lab.experiment('common log format', function () {
  lab.test('comes through as expected', function (done) {

    server1.register([
      {
        register: require('../'),
        options: {
          _test: function(log) {

            var components = log.split('"');

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

            Code.expect(components[0]).to.include('[' + expectedDate + expectedTime + ']');
            Code.expect(components[1]).to.equal('GET / HTTP/1.1');
            Code.expect(components[2]).to.equal(' 200 -');
          }
        }
      }
    ], function(err) {

      Code.expect(err).to.equal(undefined);

      server1.inject({
        url: '/'
      }, function () {
        done();
      });

    });
  });
});

lab.experiment('handling options', function () {
  lab.test('looks up IP from the header if desired', function (done) {

    server2.ext('onRequest', function (request, reply) {
      request.headers['x-forwarded-to'] = '123.45.678';
      return reply.continue();
    });

    server2.register([
      {
        register: require('../'),
        options: {
          ipHeader: 'x-forwarded-to',
          _test: function(log) {

            var components = log.split(' ');

            Code.expect(components[0]).to.equal('123.45.678');
          }
        }
      }
    ], function(err) {

      Code.expect(err).to.equal(undefined);

      server2.inject({
        url: '/'
      }, function () {
        done();
      });

    });
  });
});
