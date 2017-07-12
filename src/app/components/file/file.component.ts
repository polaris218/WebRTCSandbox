import {Component, Input} from '@angular/core';
import {FileModel} from "../../models/file.model";

@Component({
    selector: 'file',
    templateUrl: './file.component.html'
})

export class FileComponent {
    @Input() file: FileModel;
    @Input() fileIndex: any;

    deleteFile(file) {
        alert('File ' + file.Caption + ' will be removed!');
    }
}
