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
import socketClient from 'socket.io-client';

@Component({
    selector: 'files-controls',
    templateUrl: './files-controls.component.html',
    styleUrls: ['./files-controls.component.css']
})

export class FilesControlsComponent implements OnInit {
    public filetoupload: any;
    
    public item: UploadItem;
    public isUploading: boolean = false;
    public uploadIsComplete: boolean = false;
    public storageLimits: any;
    private initApiInterval: any = 0;
    public isPlaying: boolean = false;
    public bounceCounter: number;
    private subscription: any;
    public selectid: string = Math.floor(Math.random()*100).toString();
    bgMusicPlayer1 = new Howl({
        //src: 'https://audiostram0626.herokuapp.com/audio/' + this.selectid,
        src: 'http://localhost:3000/audio/' + this.selectid ,
       // src: 'http://localhost:8000',
        html5: false,
        _webAudio :true,
        format: ['flac', 'aac','mp3'],
        onplay: () => {
            
            console.log( this.bgMusicPlayer1.state())
            console.log("playing");
        },
        onplayerror: () => {
            console.log("palyerror!!!");
        },
        onstop: () => {
           
            console.log("stop!!!");
        },  
        onloaderror : () => {
            this.bgMusicPlayer1.unload();
              console.log("load error!!!");
          },
        onend: () => {
        console.log("end");
        this.isPlaying = false;
       // this.bgMusicPlayer1.unload();
        console.log( this.bgMusicPlayer1.state());
          }
        
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
        const socket = socketClient('http://localhost:3000/audio/10');
        socket.emit('track', (e) => {
            console.log("client socket is working");
        });
       
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
        localStorage.setItem('memory', <string>this.bgMusicPlayer1.seek());
      
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
            this.bgMusicPlayer1.pause();
          
        
    }
        else {
        this.bgMusicPlayer1.play(); 
       
        
        
        }
       
        
        //console.log("dragon"+dragon);
        
        this.isPlaying = !this.isPlaying;
    
        let msg = this.isPlaying ? { PlayStream: true} : { PauseStream: true };

        this.socketService.send({
            StreamingEvents: msg
        });
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

}
