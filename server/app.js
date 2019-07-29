const express = require('express')
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();
const ss = require('socket.io-stream');

  
app.use(express.static(path.join(__dirname, 'public')));
// allow-cors
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*" );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  
    next();
 
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/video', function(req, res) {
  const path = 'assets/10.flac'
  const stat = fs.statSync(path);
  const fileSize = stat.size
  const range = req.headers.range;

  

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end}, { highWaterMark: 128 * 1024 })
  
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize/20,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head);
   // console.log(req);
    //console.log(res);
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path , { highWaterMark: 128 * 1024 }).pipe(res)
  }
})

app.get('/audio/:id', function(req, res) {
  const path = 'assets/'+ '10.flac';
  
  const stat = fs.statSync(path)
  const fileSize = stat.size;
  const range = req.headers.range;
//console.log("range==================>"+range)
  if (range) {
    
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
   // console.log("start"+ start);
    //console.log("end"+ end);
    const chunksize = (end-start)+1;
     //create read stream
    const file = fs.createReadStream(path, {start, end }, { highWaterMark: 3 * 192 })
   //const file = fs.createReadStream(path)
    const head = {
      'Content-Range': `bytes ${start}-${end }/${fileSize }`,
      'Accept-Ranges': 'bytes',
     // 'Content-Length': chunksize,
      'Content-Type': 'audio/flac',
      'Transfer-Encoding': 'chunked'
    }

    res.writeHead(206, head);
     // attach this stream with response stream
    file.pipe(res);
   //console.log(res);
  } else {
    const head = {
     // 'Content-Length': fileSize,
      'Content-Type': 'audio/flac',
      'Transfer-Encoding': 'chunked'

    } 
    res.writeHead(200, head);
   fs.createReadStream(path,{ highWaterMark: 3 * 192 }).pipe(res);
    //console.log(res);
  }
 
})

app.set('port', (process.env.PORT || 3000))

const server = app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});const io = require('socket.io').listen(server);

const factor = 2.00; // change this number to change buffer size.

io.on('connection', (client) => {
  console.log('web socket '+Math.floor(Math.random()*100).toString() + ' connected');
 
  const stream = ss.createStream();
  client.emit('hello');
  client.on('track', () => {
    console.log("connected on stream");
    const filePath = 'assets/'+ '10.flac';
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath, { highWaterMark: 1024 * 1024 * factor });
    // pipe stream with response stream
    readStream.pipe(stream);
    ss(client).emit('track-stream', stream, { stat });
  }); 
  client.on('disconnect', () => {console.log("disconnect")});
});




/* app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
}); */