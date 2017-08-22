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
        let progress = this.mixDownProgress.CurrentProgress / this.mixDownProgress.TotalToProcess;

        if (progress >= 1) {
            this.completeMixDown();
        }

        return Math.round(progress * 100);
    }

    public cancelMixdown() {
        let msg = {
            BounceCancelledEvent: true
        };

        this.senSocketMessage(msg);

        this.close();
    }

    public closeMixdownPopup() {
        let msg = {
            BounceDialogClosedEvent: true
        };

        this.senSocketMessage(msg);

        this.close();
    }

    private completeMixDown() {
        let msg = {
            BounceCompleteEvent: true
        };

        this.senSocketMessage(msg);

        this.close();
    }

    private senSocketMessage(msg) {
        this.socketService.send({
            BounceEvents: msg
        });
    }
}