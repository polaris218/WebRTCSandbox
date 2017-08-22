import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";

@Component({
    selector: 'legen',
    templateUrl: './legend.popup.html'
})
export class LegendPopup extends PopupContent {
    protected data: any;

    constructor(popupService: PopupService) {
        super(popupService);
    }
}