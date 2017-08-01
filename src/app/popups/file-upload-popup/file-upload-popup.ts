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
    public item: UploadItem;

    constructor(popupService: PopupService, private uploadService: UploadService) {
        super(popupService);

        this.item = new UploadItem();
    }

    getUploadedPercent() {
        return this.uploadService.getProgress();
    }

    getUploadedPart() {
        return Math.round(this.item.duration * this.uploadService.getProgress() / 100) || 0;
    }

    prepareToUploadFile($event) {
        this.item.file = $event.srcElement.files[0];

        this.checkFileDuration();
    }

    private checkFileDuration() {
        let audio = new Audio();
        audio.src = URL.createObjectURL(this.item.file);

        audio.addEventListener("loadedmetadata", () => {
            this.item.duration = Math.round(audio.duration);
        });
    }

    private isUploadable() {
        return true;
    }

    uploadFile(f: NgForm) {
        if (this.isUploadable()) {
            this.uploadService.upload(this.item);

            this.uploadService.onProgressUpload = (item, percentComplete) => {
                console.log(item, percentComplete);
            };
        }
    }
}