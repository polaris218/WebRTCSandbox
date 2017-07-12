import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";

@Component({
    selector: 'popup',
    templateUrl: './popup.module.html',
})
export class Popup {
    constructor(protected popupService: PopupService) {
    }

    onOverlayClick($event: MouseEvent) {
        (<Element>$event.target).hasAttribute('close-popup') && this.popupService.close();
    }
}