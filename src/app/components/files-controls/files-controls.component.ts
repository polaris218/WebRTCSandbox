import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
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





@Component({
    selector: 'files-controls',
    templateUrl: './files-controls.component.html',
    styleUrls: ['./files-controls.component.css']
})

export class FilesControlsComponent implements OnInit {
    public filetoupload: any;
    private url = 'http://localhost:3000';
    private herokuurl = 'https://audiostram0626.herokuapp.com';
    private socket;
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
    bgMusicPlayer1 = new Howl({
        src: 'https://audiostram0626.herokuapp.com/audio/' + this.selectid,
        //src: 'http://localhost:3000/audio/'+ this.selectid ,
        format: ['flac', 'aac','mp3'],
      });

    @Input() socketData: any;

    constructor(
        private uploadService: UploadService,
        private apiService: ApiService,
        private socketService: SocketService,
        private popupService: PopupService,
        private shareService: ShareData
    ) {

        this.init();
        this.socket = io(this.url);
        //this.socket = io(this.herokuurl)
        let urlarray = [];
        const music = new Uint8Array(0);
        this.socket.emit('track', () => { console.log("emit track");
        });
        this.socket.on('hello', () => {  
            this.isConnected = true;
            console.log(this.isConnected);
         });
        ss(this.socket).on('track-stream', (stream, { stat }) => {
            console.log("tracking stream from server");
            let rate = 0;
            let isData = false;
            this.source = null;
            this.isConnected = true;
            stream.on('data', async (data) => {
                const newaudioBuffer = (this.source)
                    ? this.appendbuffer(this.source, data)
                    : data;
                this.source = newaudioBuffer;
                const loadRate = (data.length * 100 ) / stat.size;
                rate = rate + loadRate;
               // console.log(stat.size/data.length+ "times");
                if(rate > 99.99 ) { 
                    let blob = new Blob([newaudioBuffer], { type: 'audio/flac' })
                    let url = window.URL.createObjectURL(blob);
                    this.soundPlayer = new Howl({
                        src: url,
                        format: ['wav','flac', 'aac','mp3'],
                       
                    });
                }

            });
            
            
        })
        this.socket.on('disconnect',  () => { 
            //console.log("disconenct");
            
            this.soundPlayer.pause();
            this.isConnected = false;
            this.isPlaying = false;

        })
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
        const  seektime  = parseFloat( localStorage.getItem('memory'));
        console.log("loading"+seektime);
        Howler.usingWebAudio = true;
        this.bgMusicPlayer1._webAudio = true;
        this.bgMusicPlayer1._html5 = false;
        this.bgMusicPlayer1.seek(seektime);
        
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
       // localStorage.setItem('memory', <string>this.bgMusicPlayer1.seek());
      
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
      console.log("IsUsing WebAudio => " +  this.soundPlayer._webAudio);
        if ( this.isPlaying ) {
           // this.bgMusicPlayer1.pause();
           if( this.isConnected) {
            this.soundPlayer.pause(); 
         }
                
        }
        else {
         // this.bgMusicPlayer1.play();
         if( this.isConnected) {
            this.soundPlayer.play();
            
         }
             
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

    public getCurrentDuration(): number {
        

        return <number>this.bgMusicPlayer1.seek();
       
      
    }

    public getMaxDuration(): number {
        return <number>this.bgMusicPlayer1.duration();
    }
    public appendbuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
      };
    
}
