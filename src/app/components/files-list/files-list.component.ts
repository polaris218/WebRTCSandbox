import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {SocketService} from "../../../../src/app/services/socket.service";

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

    constructor(private apiService: ApiService, private socketService: SocketService) {
        this.checkIfApiInited();
    }

    checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.apiService.isInited()) {
                this.getFilesList();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    getFilesList() {
        this.apiService.GetSandboxState(res => {
            this.filesState = res.State;

            this.filesState.FileList.sort((a, b) => {
                if (a.IsOwned > b.IsOwned) {
                    return -1;
                } else if (a.IsOwned < b.IsOwned) {
                    return 1;
                } else {
                    return a.FileId - b.FileId;
                }
            });
        });
    }

    deleteFile(file) {
        let msg = {
            AudioFileListEvents: {
                FileDelete: {
                    FileId: file.FileId
                }
            }
        };
        this.socketService.send(msg);

        this.getFilesList();
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

        let msg = {
            AudioFileListEvents: {
                FxFileChangedId: this.filesState.FxAudioFileId
            }
        };
        this.socketService.send(msg);
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

        let msg = {
            AudioFileListEvents: {
                BackgroundFileChangedId: this.filesState.BackgroundAudioFileId
            }
        };
        this.socketService.send(msg);
    }

    /**
     * TODO: вынести минимальное и максимальное значение в конфиг
     *
     * */
    setVolumeToMin(file) {
        file.Volume = 0;

        this.onVolumeChange(file.Volume, file);
    }

    setVolumeToMax(file) {
        file.Volume = 100;

        this.onVolumeChange(file.Volume, file);
    }

    onVolumeChange($event, file) {
        let msg = {
            AudioFileListEvents: {
                VolumeChange: {
                    FileId: file.FileId,
                    Volume: $event
                }
            }
        };
        this.socketService.send(msg);
    }
}
