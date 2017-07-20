import {Component, Input} from '@angular/core';
import {FileModel} from "../../models/file.model";

@Component({
    selector: 'file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.css']
})

export class FileComponent {
    @Input() file: FileModel;
    @Input() fileIndex: any;
    @Input() fxSelected: number;
    @Input() bSelected: number;

    deleteFile(file) {
        alert('File ' + file.Caption + ' will be removed!');
    }

    selectFx(file) {
        alert('File ' + file.Caption + ' will be marked as FX!');
    }

    selectB(file) {
        alert('File ' + file.Caption + ' will be marked as B!');
    }
}
