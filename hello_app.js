var adr = require('url');
var http = require('http');
const MongoClient = require('mongodb').MongoClient;

var port = process.env.PORT || 3000;
const url = "mongodb+srv://jstewa12:ijams768@cluster0-v4rg9.mongodb.net/test?retryWrites=true&w=majority";
http.createServer((request, response) => {
    if (request.url === '/favicon.ico') {
        console.log("Fucking favicon");
        response.end();
        return;
    }

    response.writeHead(200, {'Content-Type':'text/html'});
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }

        var quotesgame = db.db("quotes-game");
        var highscores = quotesgame.collection("high-scores");
        var scoreStream = highscores.find().stream();
        var scoreArray = [];

        scoreStream.on("data", function(item) {
            response.write("Name: " + item["name"] + "\nScore: " + item["score"] + "\n\n");
            scoreArray.push(item);
        });

        scoreStream.on("end", function(item) {
            var length = scoreArray.length;

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (scoreArray[i]["score"] > scoreArray[j]["score"]) {
                        var item = scoreArray[i];
                        scoreArray[i] = scoreArray[j];
                        scoreArray[j] = item;
                    }
                }
            }

            for (var i = 0; i < length; i++) {
                response.write("Name: " + scoreArray[i]["name"] + "\nScore: " + scoreArray[i]["score"] + "\n\n");
            }

            response.end();
            db.close();
        })
    });
}).listen(8080);
