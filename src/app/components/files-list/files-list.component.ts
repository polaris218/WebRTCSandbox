import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'files-list',
    templateUrl: './files-list.component.html',
    styleUrls: ['./files-list.component.css']
})

/**
 * TODO:
 *  1. Написать компоненту, в которой будет происходить init ApiService и наследоваться от неё
 *
 * */

export class FilesListComponent {
    initApiInterval: any = 0;
    filesState: any = {
        FileList: [],
        FxAudioFileId: 0,
        BackgroundAudioFileId: 0
    };
    scrollBarConfig: any = {
        wheelSpeed: 1
    };

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
            this.filesState = res.State;

            this.filesState.FileList.sort((a, b) => {
                if (a.isOwned > b.isOwned) {
                    return 1;
                } else if (a.isOwned < b.isOwned) {
                    return -1;
                } else {
                    return a.FileId - b.FileId;
                }
            });
        });
    }

    selectFile(file, $event: MouseEvent) {
        if (!this.preventChildElementsClick($event)) {
            file.active = !file.active;

            file.active && this.removeSelectionFromOtherFiles(file);
            file.active && console.log('File ' + file.Caption + '  is selected now!');
            !file.active && console.log('File ' + file.Caption + ' isn`t selected now!');
        }
    }

    removeSelectionFromOtherFiles(activeFile) {
        this.filesState.FileList.forEach((file) => {
            if (file.FileId !== activeFile.FileId) {
                file.active = false;
            }
        });
    }

    preventChildElementsClick($event) {
        return (<Element>$event.target).hasAttribute('non-click-by-parent') ||
            (<Element>$event.target.parentNode).hasAttribute('non-click-by-parent');
    }

    deleteFile(file) {
        console.log('File ' + file.Caption + ' will be removed!');
    }

    /**
     * TODO: как избавиться от этой простыни?
     *
     * */
    selectFx(file) {
        if (this.filesState.FxAudioFileId == file.FileId) {
            this.filesState.FxAudioFileId = 0;
            return;
        }

        if (this.filesState.BackgroundAudioFileId == file.FileId) {
            return false;
        }

        this.filesState.FxAudioFileId = file.FileId;
        console.log('File ' + file.Caption + ' will be marked as FX!');
    }

    selectB(file) {
        if (this.filesState.BackgroundAudioFileId == file.FileId) {
            this.filesState.BackgroundAudioFileId = 0;
            return;
        }

        if (this.filesState.FxAudioFileId == file.FileId) {
            return false;
        }

        this.filesState.BackgroundAudioFileId = file.FileId;
        console.log('File ' + file.Caption + ' will be marked as B!');
    }

    /**
     * TODO: вынести минимальное и максимальное значение в конфиг
     *
     * */
    setVolumeToMin(file) {
        file.Volume = 0;
    }

    setVolumeToMax(file) {
        file.Volume = 100;
    }
}
