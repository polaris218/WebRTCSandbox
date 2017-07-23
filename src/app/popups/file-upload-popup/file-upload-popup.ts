import {Component} from "@angular/core";
import {NgForm} from '@angular/forms';
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {LoadState} from "../../state/load.state";
import {UploadService} from "../../services/upload.service";
import {UploadItem} from "../../interface";

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

    prepareToUploadFile($event) {
        this.item.file = $event.srcElement.files[0];
    }

    uploadFile(f: NgForm) {
        this.uploadService.upload(this.item);
    }
}