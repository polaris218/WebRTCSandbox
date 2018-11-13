import {Component} from "@angular/core";
import {PopupService} from "../../services/popup.service";
import {PopupContent} from "../../modules/popup/popup.content.module";
import {SocketService} from "../../services/socket.service";
import {ShareData} from "../../state/share.data";

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
    public progress: number;

    constructor(
        public popupService: PopupService,
        private socketService: SocketService,
        private shareData: ShareData
    ) {
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
                this.getProgress();
                clearInterval(this.sInt);
                this.renderSocketData();
            }
        }, 100);
    }

    private getProgress() {
        this.progress = Math.round(this.mixDownProgress.CurrentProgress / this.mixDownProgress.TotalToProcess * 100);

        if (this.progress >= 100) {
            this.completeMixDown();
        }
    }

    public cancelMixdown() {
        let msg = {
            BounceCancelledEvent: true
        };

        this.senSocketMessage(msg);

        this.closePopup();
    }

    public closeMixdownPopup() {
        let msg = {
            BounceDialogClosedEvent: true
        };

        this.senSocketMessage(msg);

        this.closePopup();
    }

    private completeMixDown() {
        let msg = {
            BounceCompleteEvent: true
        };

        this.senSocketMessage(msg);

        this.closePopup();
    }

    private senSocketMessage(msg) {
        this.socketService.send({
            BounceEvents: msg
        });
    }

    public downloadMixdown() {

    }

    public closePopup() {
        this.shareData.setData('mixdown', true);

        this.close();
    }
}
