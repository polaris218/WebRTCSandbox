import {Component, EventEmitter, Output, HostListener} from "@angular/core";
import {PopupService} from "./services/popup.service";
import {LoadState} from "./state/load.state";
import {SocketService} from "./services/socket.service";
import {ApiService} from "./services/api.service";
import {LegendPopup} from "./popups/legend/legend.popup";
import {PostMessageService} from "./services/postmessage.service";

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
        this._sendPostMessage();
    }

    constructor(
        private popupService: PopupService,
        private socketService: SocketService,
        private apiService: ApiService,
        private postMessageService: PostMessageService
    ) {
        this.checkIfApiInited();
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

        this._sendPostMessage();
    }

    private _sendPostMessage() {
        const myIframe = document.getElementById('myIframe');

        this.postMessageService.sendMessage(
            0,
            {
                zoom: this.fullZoom,
                size: {
                    width: myIframe.offsetWidth,
                    height: myIframe.offsetHeight
                }
            },
            '*'
        );
    }
}
