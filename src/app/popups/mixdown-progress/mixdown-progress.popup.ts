import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {SocketService} from "../../services/socket.service";

@Component({
    selector: 'mixdown-progress',
    templateUrl: './mixdown-progress.popup.html'
})
export class MixDownPopup extends PopupContent {
    protected data: any;
    private iTmt: any;
    private sInt;
    private mixDownProgress: any = {
        CurrentProgress: 0,
        TotalToProcess: 100
    };

    constructor(popupService: PopupService, private socketService: SocketService) {
        super(popupService);

        this.renderSocketData();
    }

    private renderSocketData() {
        clearTimeout(this.iTmt);
        this.iTmt = setTimeout(() => {
            this.getSocketData();
        }, 1000);
    }

    private getSocketData() {
        clearInterval(this.sInt);
        this.sInt = setInterval(() => {
            if (this.socketService.getSocketData().MixdownProgress) {
                this.mixDownProgress = this.socketService.getSocketData().MixdownProgress;
                clearInterval(this.sInt);
                this.renderSocketData();
            }
        }, 100);
    }

    public getProgress() {
        return Math.round(
            this.mixDownProgress.CurrentProgress /
            this.mixDownProgress.TotalToProcess * 100
        );
    }

    public cancelMixdown() {

    }

    private completeMixDown() {

    }
}