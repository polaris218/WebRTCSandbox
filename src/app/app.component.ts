import {Component, EventEmitter, Output} from "@angular/core";
import {PopupService} from "./services/popup.service";
import {LoadState} from "./state/load.state";
import {SocketService} from "./services/socket.service";
import {ApiService} from "./services/api.service";
import {LegendPopup} from "./popups/legend/legend.popup";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    private rejected: boolean = false;
    protected rejectState = new LoadState();
    protected submitState = new LoadState();
    public frameIsLoaded: boolean = false;

    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @Output() onReject: EventEmitter<any> = new EventEmitter();

    initApiInterval: any = 0;
    OfferState: any = {
        BaseTotalPrice: 0,
        DiscountedTotalPrice: 0,
        IsSuccess: true,
        Offer: {
            Id: '',
            ProductList: []
        },
        TotalDiscount: 0
    };

    constructor(private popupService: PopupService, private socketService: SocketService, private apiService: ApiService) {
        this.checkIfApiInited();
    }

    public getSocketData() {
        return this.socketService.getSocketData();
    }

    checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.apiService.isInited()) {
                this.getProductsList();
                this.getAvailableSandboxList();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    getProductsList() {
        this.apiService.getCartOffer(res => {
            this.OfferState = res;
        });
    }

    onFrameLoad(myIframe) {
        this.frameIsLoaded = true;
    }

    getAvailableSandboxList() {
        this.apiService.getAvailableSandboxList(res => {
            console.log(res);
        });
    }

    showLegendPopup() {
        this.popupService.open(LegendPopup, {});
    }
}
