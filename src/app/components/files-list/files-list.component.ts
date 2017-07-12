import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'files-list',
    templateUrl: './files-list.component.html'
})

/**
 * TODO:
 *  1. Написать компоненту, в которой будет происходить init ApiService и наследоваться от неё
 *
 * */

export class FilesListComponent {
    initApiInterval: any = 0;
    filesList: any[];

    constructor(private api: ApiService) {
        this.checkIfApiInited();
    }

    checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.api.isInited()) {
                this.getFilesList();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    getFilesList() {
        this.api.GetSandboxState(res => {
            this.filesList = res.State.FileList;
            console.log(this.filesList);
        });
    }
}
