import {PopupService} from "../../services/popup.service";

export abstract class PopupContent {
    protected abstract data?: any;

    constructor(protected popupService: PopupService) {
        this.data = this.popupService.state.data;
    }

    public close() {
        this.popupService.close();
    }
}