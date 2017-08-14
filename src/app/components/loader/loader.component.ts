import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})

export class LoaderComponent {
    showIt: boolean = false;

    constructor() {
        this.show();
    }

    show() {
        setTimeout(() => {
            this.showIt = true;
        }, 100);
    }
}
