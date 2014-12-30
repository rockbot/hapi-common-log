
# hapi-common-log

Parses the hapi request object to create a common log format log line

## Usage

```js

var toCommonLogFormat = require('hapi-common-log');

server.ext('onPostHandler', function (request, next) {
  console.log(toCommonLogFormat(request));
  next();
});

// output: 127.0.0.1 - 1419961634390-24985-29768 [30/Dec/2014:09:47:14 -0800] "GET /static/images/npm-logo.svg HTTP/1.1" 200 -

```

## The Common Log Format

From the [Wikipedia page on Common Log Format](https://en.wikipedia.org/wiki/Common_Log_Format):

```
127.0.0.1 user-identifier frank [10/Oct/2000: 13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
```

_A "-" in a field indicates missing data.[citation needed]_

* 127.0.0.1 is the IP address of the client (remote host) which made the request to the server.
* user-identifier is the RFC 1413 identity of the client.
* frank is the userid of the person requesting the document.
* [10/Oct/2000:13:55:36 -0700] is the date, time, and time zone when the server finished processing the request, by default in strftime format %d/%b/%Y:%H:%M:%S %z.
* "GET /apache_pb.gif HTTP/1.0" is the request line from the client. The method GET, /apache_pb.gif the resource requested, and HTTP/1.0 the HTTP protocol.
* 200 is the HTTP status code returned to the client. 2xx is a successful response, 3xx a redirection, 4xx a client error, and 5xx a server error.
* 2326 is the size of the object returned to the client, measured in bytes.

## License

ISC
