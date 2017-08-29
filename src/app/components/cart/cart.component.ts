import {Component, Input} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {PopupService} from "../../services/popup.service";
import {BasketPopup} from "../../popups/basket/basket.popup";
import {environment} from "../../../environments/environment";
import {PageSliderModule} from 'ng2-page-slider';

@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})


export class CartComponent {
    @Input() OfferState: any;

    constructor(private api: ApiService, private popupService: PopupService) {
        this.subscribeToPostMessage();
    }

    public addToCart() {
        this.api.addToCart(res => {
            this.popupService.open(BasketPopup, {});
        });
    }

    private subscribeToPostMessage() {
        window.addEventListener('message', msg => {
            if (this.checkPmOrigin(msg)) {
                switch(JSON.parse(msg.data).type) {
                    case 'close':
                        this.closeCartPopup();
                        break;
                }
            }
        });
    }

    private checkPmOrigin(msg) {
        return environment.postmessage.origin.indexOf(msg.origin) >= 0;
    }

    private closeCartPopup() {
        this.popupService.close();
    }
}
