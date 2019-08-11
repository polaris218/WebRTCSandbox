import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectionStrategy} from "@angular/core";
import {UploadItem} from "../../interface";
import {UploadService} from "../../services/upload.service";
import {ApiService} from "../../services/api.service";
import {SocketService} from "../../services/socket.service";
import {PopupService} from "../../services/popup.service";
import {MixDownPopup} from "../../popups/mixdown-progress/mixdown-progress.popup";
import {LoadState} from "../../state/load.state";
import {ShareData} from "../../state/share.data";
import { Howl, Howler } from 'howler';
import ss from 'socket.io-stream';
import * as io from "socket.io-client";
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { async } from "q";


const pcConfig = {
  'iceServers': [{
      'urls': 'stun:stun.l.google.com:19302'
  }]
  };

  let isChannelReady = false;
  let isInitiator = false;
  let isStarted = false;
  var localStream;
  let pc ;
  let turnReady;
  let socket = io.connect('https://mighty-escarpment-12834.herokuapp.com');
  //let socket = io.connect('http://localhost:3000');




@Component({
    selector: 'files-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './files-controls.component.html',
    styleUrls: ['./files-controls.component.css']
})

export class FilesControlsComponent implements OnInit {
    public filetoupload: any;
    private url = 'http://localhost:3000';
    private herokuurl = 'https://mighty-escarpment-12834.herokuapp.com';
    public item: UploadItem;
    public isUploading: boolean = false;
    public uploadIsComplete: boolean = false;
    public storageLimits: any;
    private initApiInterval: any = 0;
    public isPlaying: boolean = false;
    public bounceCounter: number;
    private subscription: any;
    private isConnected: boolean = false;
    private source : any;
    public selectid: string = Math.floor(Math.random()*100).toString();
    public soundPlayer: any;
    WS_URL = 'http://localhost:3000'.replace(/^http/, 'ws');
    public remoteStream : MediaStream;

    @Input() socketData: any;
    @ViewChild("localVideo") localVideo;
    @ViewChild("remoteVideo") remoteVideo;
    constructor(
        private uploadService: UploadService,
        private apiService: ApiService,
        private socketService: SocketService,
        private popupService: PopupService,
        private shareService: ShareData,
    ) {

        this.init();
        


      
    }
    
    ngOnInit() {
        this.subscription = this.shareService.getData()
            .subscribe(data => {
                if (data === 'mixdown' && this.shareService[data]) {
                    this.getBounceCounter();
                }

                if (data === 'changeSandbox' && this.shareService[data]) {
                    this.streamingAudio(false);
                }
            });
        this.isPlaying = false;
        Howler.usingWebAudio = true;
       
  
    }

    private init() {
        this.checkIfApiInited();

        this.initUpload();
    }

    private checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.apiService.isInited()) {
                this.getStorageLimits();
                this.getBounceCounter();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    private getStorageLimits() {
        this.apiService.getStorageLimits(res => {
            this.storageLimits = res;
        });
    }

    /**
     * Upload item
     *
     * */
    private initUpload() {
        this.item = new UploadItem();

        this.uploadService.onCompleteUpload = () => {
            this.uploadIsComplete = true;
            setTimeout(() => {
                this.uploadIsComplete = false;
                this.showProgressBar(false);
                this.shareService.setData('upload', true);
            }, 2000);
        };
    }

    private isAbleToUploadFile(file) {
        const ex = ['audio/mp3', 'audio/flac', 'audio/wav', 'audio/ogg', 'audio/aiff'];

        return ex.indexOf(file.type.toLowerCase()) >= 0;
    }

    public prepareToUploadFile($event) {
        this.item.file = $event.srcElement.files[0];

        if (this.isAbleToUploadFile(this.item.file)) {
            this.uploadService.upload(this.item);

            this.showProgressBar(true);
        }
    }

    private showProgressBar(loop) {
        this.isUploading = loop;
    }

    public getUploadedPercent() {
        return this.uploadService.getProgress() || 0;
    }

    public getUploadedPart() {
        const size = this.item.file.size;

        if (size / 1048576 > 1) {
            return Math.round(size / 104857600 * this.getUploadedPercent());
        }

        if (size / 1024 > 1) {
            return Math.round(size / 102400 * this.getUploadedPercent());
        }

        return Math.round(size / 100 * this.getUploadedPercent());
    }

    public getFileSize() {
        const size = this.item.file.size;

        if (size / 1048576 > 1) {
            return Math.round(size / 1048576) + ' Mb';
        }

        if (size / 1024 > 1) {
            return Math.round(size / 1024) + ' Kb';
        }

        return size + ' B';
    }

    /**
     * Storage limits
     *
     * */
    public getBusySpace() {
      
        //return Math.round(this.getCurrentDuration() / this.getMaxDuration() * 100);
        return Math.round(this.storageLimits.SpaceUsedInBytes / this.storageLimits.SpaceTotalInBytes * 100);
    }

    /**
     * Play buttons
     *
     * */
    public streamingAudio(isPlaying?: boolean) {
        /* if (typeof isPlaying !== 'undefined') {
            this.isPlaying = isPlaying;
        } else {
            this.isPlaying = !this.isPlaying;
        } */
       // console.log(<number>this.bgMusicPlayer1.seek());
       
        if ( this.isPlaying ) {
           // this.bgMusicPlayer1.pause();
           if(pc) {
           isStarted = false;
           pc.close();
           pc = null;
           isInitiator = false;
          
            
           }
           
        }
        else {
          this.startStreaming();
         // this.bgMusicPlayer1.play();
        }
       
        
        //console.log("dragon"+dragon);
        
        this.isPlaying = !this.isPlaying;
    
        let msg = this.isPlaying ? { PlayStream: true} : { PauseStream: true };

        /* this.socketService.send({
            StreamingEvents: msg
        }); */
    }

    /**
     * Mixdown
     *
     * */
    public mixDown() {
        let msg = {
            BounceStarted: true
        };

        this.streamingAudio(false);

        this.socketService.send({
            BounceEvents: msg
        });

        this.popupService.open(MixDownPopup, {});
    }

    private getBounceCounter() {
        this.apiService.getBounceCounter(res => {
            this.bounceCounter = res.Value;
        });
    }

   

    
    public appendbuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
      };
    public addremote(stream) {
        this.remoteVideo.nativeElement.srcObject = stream;
    }
    
    public startStreaming() {
      
      let remoteVideo = this.remoteVideo.nativeElement
        

      // Set up audio and video regardless of what devices are present.
      var sdpConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      };
         
      ///////////////////////////
      
      var room = 'foo';
      // Could prompt for room name:
       //window.room = prompt('Enter room name:');
      
      
      
      if (room !== '') {
        socket.emit('create or join', room);
        console.log('Attempted to create or  join room', room);
      }
      
      socket.on('created', function(room) {
        console.log('Created room ' + room);
        isInitiator = true;
      });
      
      socket.on('full', function(room) {
        console.log('Room ' + room + ' is full');
      });
      
      socket.on('join', function (room){
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        isChannelReady = true;
      });
      
      socket.on('joined', function(room) {
        console.log('joined: ' + room);
        isChannelReady = true;
      });
      
      socket.on('log', function(array) {
        console.log.apply(console, array);
      });
      
      /////////////////////////////////////
      
      function sendMessage(message) {
        console.log('Client sending message: ', message);
        socket.emit('message', message);
      }
      //Dragonks
      // This client receives a message
      socket.on('message',  function (message) {
        console.log('Client received message:', message);
        if (message === 'got user media') {
          console.log(1000);
           maybeStart();
        } else if (message.type === 'offer') {
          if (!isInitiator && !isStarted) {
             maybeStart();
          }
           pc.setRemoteDescription(new RTCSessionDescription(message));
          doAnswer();
        } else if (message.type === 'answer' && isStarted) {
           pc.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate' && isStarted) {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
          });
         pc.addIceCandidate(candidate);
        } else if (message === 'bye' && isStarted) {
          
           handleRemoteHangup();
        }
      });
      
      ////////////////////////////////////////////////////
      
      if (isInitiator) {
        maybeStart();
      }
      sendMessage('got user media');
      
      var constraints = {
        video: false,
        audio: true
      };
      
      console.log('Getting user media with constraints', constraints);
      
      if (location.hostname !== 'localhost') {
        requestTurn(
          'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
        );
      }
      
      function maybeStart() {
        console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
        if (!isStarted && typeof localStream === 'undefined' && isChannelReady) {
          console.log('>>>>>> creating peer connection');
          createPeerConnection();
         // pc.addStream(localStream);
          isStarted = true;
          console.log('isInitiator', isInitiator);
          if (isInitiator) {
            doCall();
          }
        }
      }
      
      window.onbeforeunload = function() {
        sendMessage('bye');
      };
      
      /////////////////////////////////////////////////////////
      
      function createPeerConnection() {
        
          pc = new RTCPeerConnection(null);
          pc.onicecandidate = handleIceCandidate;
          pc.onaddstream = handleRemoteStreamAdded;
          pc.onremovestream = handleRemoteStreamRemoved;
          console.log('Created RTCPeerConnnection');
        
      }
      
      function handleIceCandidate(event) {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
          sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          });
        } else {
          console.log('End of candidates.');
        }
      }
      
      function handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
      }
      
      function doCall() {
        console.log('Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
      }
      
      function doAnswer() {
        console.log('Sending answer to peer.');
        pc.createAnswer().then(
          setLocalAndSendMessage,
          onCreateSessionDescriptionError
        );
      }
      
      function setLocalAndSendMessage(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        console.log('setLocalAndSendMessage sending message', sessionDescription);
        sendMessage(sessionDescription);
      }
      
      function onCreateSessionDescriptionError(error) {
        trace('Failed to create session description: ' + error.toString());
      }
      
      function requestTurn(turnURL) {
        var turnExists = false;
        for (var i in pcConfig.iceServers) {
          if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
            turnExists = true;
            turnReady = true;
            break;
          }
        }
        if (!turnExists) {
          console.log('Getting TURN server from ', turnURL);
          // No TURN server. Get one from computeengineondemand.appspot.com:
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var turnServer = JSON.parse(xhr.responseText);
              const dragon = {
                  urls: 'turn:' + turnServer.username + '@' + turnServer.turn,
                  credential : turnServer.password
              }
              console.log('Got TURN server: ', turnServer);
              pcConfig.iceServers.push( dragon);
              turnReady = true;
            }
          };
          xhr.open('GET', turnURL, true);
          xhr.send();
        }
      }
      
      function handleRemoteStreamAdded(event) {
        
        console.log('Remote stream added.');
        console.log(event);
        this.remoteStream = event.stream;
        console.log(event.stream);
        remoteVideo.srcObject = event.stream
        if (this.remoteStream.getAudioTracks().length > 0) {
          console.log('Remote user is sending Audio');
      } else {
          console.log('Remote user is not sending Audio');
      }
      
        /* aCtx = new AudioContext();
        analyser = aCtx.createAnalyser();
        microphone = aCtx.createMediaStreamSource(event.stream);
        microphone.connect(analyser);
        analyser.connect(aCtx.destination);
       */
      }
        
      function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
      }
      
      
      
      function handleRemoteHangup() {
        console.log('Session terminated.');
        stop();
        isInitiator = false;
        
      }
      
      function stop() {
        isStarted = false;
        pc.close();
        pc = null;
      }
      function trace(text) {
          text = text.trim();
          const now = (window.performance.now() / 1000).toFixed(3);
        
          console.log(now, text);
        }
    }
  
}
