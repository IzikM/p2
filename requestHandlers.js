var fs = require("fs");
var fileRoot = ".\\assets\\";

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" ' +
    'content="text/html; charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/upload" enctype="multipart/form-data" ' +
    'method="post">' +
    '<input type="file" name="upload" multiple="multiple">' +
    '<input type="submit" value="Upload file" />' +
    '</form>' +
    '</body>' +
    '</html>';

  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  response.write(body);
  response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function (error, fields, files) {
    console.log("parsing done");

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function (err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {
    "Content-Type": "image/png"
  });
  fs.createReadStream("/tmp/test.png").pipe(response);
}

function config(response) {
  var fileName = fileRoot + "config.4node";
  getFile(response, fileName);
}

function auth(response) {
  var fileName = fileRoot + "auth.4node";
  getFile(response, fileName);
}

function getFile(response, fileName) {
  console.log("getting file ", fileName);
  fs.exists(fileName, function (exists) {
    if (exists) {
      fs.stat(fileName, function (error, stats) {
        fs.open(fileName, "r", function (error, fd) {
          var buffer = new Buffer(stats.size);

          fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
            var data = buffer.toString("utf8", 0, buffer.length);

            fs.close(fd);
            response.writeHead(200, {
              "Content-Type": "text/html"
            });
            response.write(data);
            response.end();
          });
        });
      });
    }
  });
}

function no_page_found(response) {
  console.log("favicon :-)");
  response.writeHead(404, {
    "Content-Type": "text/html"
  });
  response.write("No way");
  response.end();

}
exports.start = start;
exports.upload = upload;
exports.show = show;


exports.config = config;
exports.auth = auth;
exports.no_page_found = no_page_found;