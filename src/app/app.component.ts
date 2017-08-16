import {Component, EventEmitter, Output} from "@angular/core";
import {PopupService} from "./services/popup.service";
import {TestPopup} from "./popups/popup-test/popup-test.content";
import {LoadState} from "./state/load.state";
import {SocketService} from "./services/socket.service";
import {ApiService} from "./services/api.service";

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

    constructor(private popupService: PopupService, private socket: SocketService, private api: ApiService) {
        this.checkIfApiInited();
    }

    getGpuServerLoad() {
        return this.socket.getGpuServerLoad();
    }

    checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.api.isInited()) {
                this.getProductsList();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    getProductsList() {
        this.api.getCartOffer(res => {
            this.OfferState = res;
        });
    }

    onFrameLoad(myIframe) {
        this.frameIsLoaded = true;
    }
}