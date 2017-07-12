import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {LoadState} from "../../state/load.state";

@Component({
    selector: 'test-popup',
    templateUrl: './popup-test.content.html'
})
export class TestPopup extends PopupContent {
    protected data: any;
    protected submitState = new LoadState();

    constructor(popupService: PopupService) {
        super(popupService);
    }

}