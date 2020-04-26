var http = require('http');

var port = process.env.PORT || 8080;
http.createServer((request, response) => {
    if (request.url === '/favicon.ico') {
        console.log("Fucking favicon");
        response.end();
        return;
    }

    response.write("Hello world!");
    console.log("Hello world!");
    response.end();
}).listen(port);
