import {Type} from "@angular/core";
import {environment} from "../environments/environment";

export interface popupState {
    show: boolean
    component?: Type<any>
    data?: any
}

export class UploadItem {
    method: string = environment.upload.method;
    url: string = environment.upload.url;
    headers: any = {};
    formData: any = {};
    withCredentials = false;
    alias: string = 'file';
    file: File;
    duration: number = 0;

    getFileSize() {
        return this.file.size;
    }
}