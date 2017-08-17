import {Component, Input, Output, EventEmitter} from "@angular/core";
import {UploadItem} from "../../interface";
import {UploadService} from "../../services/upload.service";
import {ApiService} from "../../services/api.service";
import {SocketService} from "../../services/socket.service";

@Component({
    selector: 'files-controls',
    templateUrl: './files-controls.component.html',
    styleUrls: ['./files-controls.component.css']
})

export class FilesControlsComponent {
    public filetoupload: any;
    public item: UploadItem;
    public isUploading: boolean = false;
    public uploadIsComplete: boolean = false;
    public storageLimits: any;
    private initApiInterval: any = 0;
    public isPlaying: boolean = false;

    @Input() gpuServerLoad: any;

    constructor(private uploadService: UploadService, private apiService: ApiService, private socketService: SocketService) {
        this.init();
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
    public streamingAudio() {
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

        this.socketService.send({
            BounceEvents: msg
        });
    }
}
