import {Component, EventEmitter, Output, HostListener} from "@angular/core";
import {PopupService} from "./services/popup.service";
import {LoadState} from "./state/load.state";
import {SocketService} from "./services/socket.service";
import {ApiService} from "./services/api.service";
import {LegendPopup} from "./popups/legend/legend.popup";
import {PostMessageService} from "./services/postmessage.service";
import {environment} from "../environments/environment";

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
    public fullZoom: boolean = false;

    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @Output() onReject: EventEmitter<any> = new EventEmitter();
    @Output() postMessage: EventEmitter<any> = new EventEmitter();

    private initApiInterval: any = 0;
    public OfferState: any = {
        BaseTotalPrice: 0,
        DiscountedTotalPrice: 0,
        IsSuccess: true,
        Offer: {
            Id: '',
            ProductList: []
        },
        TotalDiscount: 0
    };
    public SandboxList: any;
    public ActiveSandBox: any;
    public sandboxListShown: boolean = false;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.sendPmRequest('resize');
    }

    constructor(
        private popupService: PopupService,
        private socketService: SocketService,
        private apiService: ApiService,
        private postMessageService: PostMessageService
    ) {
        this.checkIfApiInited();

        this.postMessageService.onMessage.subscribe({
            next: (event: any) => {
                if (event['productFrame']) {
                    switch(event['type']) {
                        case 'frameLoaded':
                            this.sendPmRequest('init');
                            break;
                        case 'resizeFrame':
                            this.sendPmRequest('resize');
                            break;
                    }
                }
            }
        });
    }

    public getSocketData() {
        return this.socketService.getSocketData();
    }

    private checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.apiService.isInited()) {
                this.getProductsList();
                this.getAvailableSandboxList();

                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    private getProductsList() {
        this.apiService.getCartOffer(res => {
            this.OfferState = res;
        });
    }

    public onFrameLoad(myIframe) {
        this.frameIsLoaded = true;
        let r = 0;

        this.sendPmRequest('init');
    }

    private getAvailableSandboxList() {
        this.apiService.getAvailableSandboxList(res => {
            this.SandboxList = res.SandboxList;
            this.ActiveSandBox = this.SandboxList[0];
            this.SandboxList.forEach(s => {
                s.Current = false;
                if (s.UniqueHash === res.ActiveSandboxUniqueHash) {
                    s.Current = true;
                    this.ActiveSandBox = s;
                }
            });

            this.sendPmRequest('init');
        });
    }

    public setActiveSandbox(sandbox: any) {
        this.ActiveSandBox = sandbox;
        this.sandboxListShown = false;
    }

    public showLegendPopup() {
        this.popupService.open(LegendPopup, {});
    }

    public toggleSandboxList() {
        this.sandboxListShown = !this.sandboxListShown;
    }

    public zoomIFrameContent() {
        this.fullZoom = !this.fullZoom;

        this.sendPmRequest('zoom');
    }

    private sendPmRequest(type) {
        const myIframe = document.getElementById('myIframe');

        this._sendPostMessage({
            type: type,
            zoom: this.fullZoom,
            size: {
                width: myIframe.offsetWidth,
                height: myIframe.offsetHeight
            }
        });
    }

    private _sendPostMessage(msg) {
        this.postMessageService.sendMessage(msg);
    }
}
