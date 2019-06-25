const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express();
var sox = require('sox-stream');

//audio stream 
/*       var src = fs.createReadStream('assets/03Boyfriend.flac')
      var transcode = sox({
          output: {
              bits: 24,
              rate: 48000,
              channels: 2,
              type: 'flac'
          }
      })
      var dest = fs.createWriteStream('assets/10.flac')
      src.pipe(transcode).pipe(dest) 
      transcode.on('error', function (err) {
          console.log('oh no! ' + err.message)
      })
      transcode.on('progress', function(amountDone, amountTotal) {
        console.log("progress", amountDone,"of", amountTotal);
      }); */
// these options are all default, you can leave any of them off




app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/video', function(req, res) {
  const path = 'assets/10.mp4'
  const stat = fs.statSync(path);
  const fileSize = stat.size
  const range = req.headers.range;

  

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
  
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
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
    fs.createReadStream(path).pipe(res)
  }
})

app.get('/audio/:id', function(req, res) {
  const path = 'assets/'+ '10.flac';
  
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    var file = fs.createReadStream(path, {start, end})
   //const file = fs.createReadStream(path)
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/flac',
    }

    res.writeHead(206, head);

    file.pipe(res);
   
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/flac',
    }
    res.writeHead(200, head)
  
   fs.createReadStream(path).pipe(res);
    
  }
 
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});