import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {UploadItem} from "../../interface";
import {UploadService} from "../../services/upload.service";
import {ApiService} from "../../services/api.service";
import {SocketService} from "../../services/socket.service";
import {PopupService} from "../../services/popup.service";
import {MixDownPopup} from "../../popups/mixdown-progress/mixdown-progress.popup";
import {LoadState} from "../../state/load.state";
import {ShareData} from "../../state/share.data";

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

    public prepareToUploadFile($event) {
        this.item.file = $event.srcElement.files[0];

        this.uploadService.upload(this.item);

        this.showProgressBar(true);
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
        return Math.round(this.storageLimits.SpaceUsedInBytes / this.storageLimits.SpaceTotalInBytes * 100);
    }

    /**
     * Play buttons
     *
     * */
    public streamingAudio(isPlaying?: boolean) {
        if (typeof isPlaying !== 'undefined') {
            this.isPlaying = isPlaying;
        } else {
            this.isPlaying = !this.isPlaying;
        }

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
}
