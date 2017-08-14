import {Component} from "@angular/core";
import {NgForm} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {LoadState} from "../../state/load.state";
import {UploadService} from "../../services/upload.service";
import {UploadItem} from "../../interface";
import {Observable} from "rxjs";

@Component({
    selector: 'file-upload-popup',
    templateUrl: './file-upload-popup.html'
})
export class FileUploadPopup extends PopupContent {
    protected data: any;
    protected submitState = new LoadState();

    constructor(popupService: PopupService, private uploadService: UploadService) {
        super(popupService);

        this.checkFileDuration();
    }

    public getUploadedPercent() {
        return this.uploadService.getProgress();
    }

    public getUploadedPart() {
        return Math.round(this.data.duration * this.uploadService.getProgress() / 100) || 0;
    }

    private checkFileDuration() {
        let audio = new Audio();
        audio.src = URL.createObjectURL(this.data.file);

        audio.addEventListener("loadedmetadata", () => {
            this.data.duration = Math.round(audio.duration);
            this.uploadFile();
        });
    }

    private isUploadable() {
        return true;
    }

    private uploadFile() {
        if (this.isUploadable()) {
            this.uploadService.upload(this.data);

            this.uploadService.onProgressUpload = (item, percentComplete) => {
            };
        }
    }

    public close() {
        this.popupService.close();
    }
}