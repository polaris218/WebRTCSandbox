const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express();

//audio stream 
/* var src = fs.createReadStream('assets/03Boyfriend.flac')
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
/* var job = sox.transcode('13.mp3', 'dest.mp3', {
  sampleRate: 44100,
  format: 'mp3',
  channelCount: 2,
  bitRate: 192 * 1024,
  compressionQuality: 5, // see `man soxformat` search for '-C' for more info
});
job.on('error', function(err) {
  console.error(err);
});
job.on('progress', function(amountDone, amountTotal) {
  console.log("progress", amountDone, amountTotal);
});
job.on('src', function(info) {
  console.log(info)
  
});
job.on('dest', function(info) {
  console.log(info)
  
});
job.on('end', function() {
  console.log("all done");
});
job.start(); */





app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
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
    console.log(res);
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
console.log("range==================>"+range)
  if (range) {
    
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    console.log("start"+ start);
    console.log("end"+ end);
    const chunksize = (end-start)+1;
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

    file.pipe(res);
   //console.log(res);
  } else {
    const head = {
     // 'Content-Length': fileSize,
      'Content-Type': 'audio/flac',
      'Transfer-Encoding': 'chunked'

    }
    res.writeHead(200, head)
  
   fs.createReadStream(path,{ highWaterMark: 3 * 192 }).pipe(res);
    console.log(res);
  }
 
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});