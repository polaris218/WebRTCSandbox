import {Component, EventEmitter, Output, Input} from "@angular/core";
import {LoadState} from "../../state/load.state";
import {PopupService} from "../../services/popup.service";
import {FileUploadPopup} from "../../popups/file-upload-popup/file-upload-popup";

@Component({
    selector: 'files-controls',
    templateUrl: './files-controls.component.html',
    styleUrls: ['./files-controls.component.css']
})

export class FilesControlsComponent {
    private rejected: boolean = false;
    protected rejectState = new LoadState();
    protected submitState = new LoadState();

    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @Output() onReject: EventEmitter<any> = new EventEmitter();

    @Input() gpuServerLoad: any;

    constructor(private popupService: PopupService) {}

    uploadFile() {
        this.popupService.open(FileUploadPopup, {})
            .subscribe(() => {
                this.rejected = true;
                this.onReject.emit();
            });
    }
}
