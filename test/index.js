var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    toCommonLogFormat = require('../'),
    server;

  server = Hapi.createServer();

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply(200);
    }
  });


describe('common log format', function () {
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
});