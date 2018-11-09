
var http = require("http");
var fs = require('fs');
//var ace= require('lib/ace');

function onRequest(request,response){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write("Hello World");
        response.end();
        }

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(443);
});


//http.createServer(onRequest).listen(443);
