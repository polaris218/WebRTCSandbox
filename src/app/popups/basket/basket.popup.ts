import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";

@Component({
    selector: 'basket',
    templateUrl: './basket.popup.html'
})
export class BasketPopup extends PopupContent {
    protected data: any;

    constructor(popupService: PopupService) {
        super(popupService);
    }
}