var moment  = require('moment-tokens');

var internals = {};

exports.register = function(server, options, next) {

  server.ext('onPostHandler', function (request, reply) {

    var rawReq = request.raw.req;

    var method = rawReq.method,
        path = rawReq.url,
        httpProtocol = rawReq.client ? rawReq.client.npnProtocol : 'HTTP/' + rawReq.httpVersion;

    var clientIp = options && options.ipHeader && request.headers[options.ipHeader] || request.info.remoteAddress,
        clientId = '-',
        userid = request.id,
        time = '[' + moment().strftime('%d/%b/%Y:%H:%M:%S %z') + ']',
        requestLine = '"' + [method, path, httpProtocol].join(' ') + '"',
        statusCode = request.response.statusCode,
        objectSize = '-';

    var lastLog = [clientIp, clientId, userid, time, requestLine, statusCode, objectSize].join(' ');

    if (options._test) {
      options._test(lastLog);
    }

    return reply.continue();
  });

  next();

};

exports.register.attributes = {
  name: 'hapi-common-log',
  version: '1.2.0'
};
