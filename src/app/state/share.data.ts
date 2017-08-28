import {Output, EventEmitter} from '@angular/core';

export class ShareData {
    sharedData: any;

    changing: EventEmitter<any> = new EventEmitter();

    constructor() {}

    public setData(key: string, val: any) {
        this[key] = val;

        this.changing.emit(key);
    }

    public getData() {
        return this.changing;
    }
}