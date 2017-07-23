import {Component} from "@angular/core";
import {NgForm} from '@angular/forms';
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {LoadState} from "../../state/load.state";
import {UploadService} from "../../services/upload.service";

@Component({
    selector: 'file-upload-popup',
    templateUrl: './file-upload-popup.html'
})
export class FileUploadPopup extends PopupContent {
    protected data: any;
    protected submitState = new LoadState();
    filesList: File[];

    constructor(popupService: PopupService, private uploadService: UploadService) {
        super(popupService);
    }

    prepareToUploadFile($event) {
        this.filesList = $event.srcElement.files;
    }

    uploadFile(f: NgForm) {
        this.uploadService.uploadFiles(this.filesList).subscribe(res => {
            console.log(res);
        });
    }
}