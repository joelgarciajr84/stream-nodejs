var http = require('http'), 
    fs = require('fs'),
    url = require('url'),
    path = require('path');


var home, current_movie;
var video_path = 'f16.mp4';
fs.readFile(path.resolve(__dirname,video_path), function (err, data) {
    if (err) {
        throw err;
    }
    current_movie = data;
});


fs.readFile(path.resolve(__dirname,"index.html"), function (err, data) {
    if (err) {
        throw err;
    }
    home = data;    
});

//http server
http.createServer(function (req, res) {
    
    var whatdoyouwnat = url.parse(req.url).pathname;
    //improve this
            var total = current_movie.length;

            var range = req.headers.range;
            console.log("Hi I'm the start range: "+ range);
            if (range) {
                console.log("Hi I'm the range now: "+ range);
            var partials = range.replace(/bytes=/, "").split("-");
            console.log(partials);
            var start = parseInt(partials[0], 30);
            var finish = partials[1] ? parseInt(partials[1], 30) : total - 1;
            var position_size = (finish-start)+1;

                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + finish + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": position_size,
                                     "Content-Type":"video/mp4"});
                res.end(current_movie.slice(start, finish+1), "binary");
            }else{
                res.writeHead(200, {"Content-Type":"video/mp4"} );
                res.write(video_path, "binary");
            }
            res.end;
}).listen(2384); 