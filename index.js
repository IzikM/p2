var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
// Each handle is the function per the route!
handle["/config"] = requestHandlers.config;
handle["/auth"] = requestHandlers.auth;
handle["/favicon.ico"] = requestHandlers.no_page_found;

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);