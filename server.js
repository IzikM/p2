var http = require("http");
var url = require("url");

function start(route, handle) {
  // callback function
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Node request origin=>", request.headers.origin);
    console.log("Request for " + pathname + " received.");
    request.setEncoding("utf8");
    response.setHeader('Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials, ' +
      'Access-Control-Allow-Origin, ' +
      'Access-Control-Allow-Headers, ' +
      'Access-Control-Allow-Methods, ' +
      'Content-Type, X-Auth-Token');
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);

    request.addListener("data", function (postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" + postDataChunk + "'.");
    });

    request.addListener("end", function () {
      route(handle, pathname, response, postData);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;