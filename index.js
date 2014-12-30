var moment = require('moment-tokens');

module.exports = function toCommonLogFormat (request) {

  var rawReq = request.raw.req;

  var method = rawReq.method,
      path = rawReq.url,
      httpProtocol = rawReq.client ? rawReq.client.npnProtocol : 'HTTP/' + rawReq.httpVersion;

  var clientIp = request.info.remoteAddress,
      clientId = '-',
      userid = request.id,
      time = moment().strftime('%d/%b/%Y:%H:%M:%S %z'),
      requestLine = '"' + [method, path, httpProtocol].join(' ') + '"',
      statusCode = request.response.statusCode,
      objectSize = '-';

  return [clientIp, clientId, userid, time, requestLine, statusCode, objectSize].join(' ');
};