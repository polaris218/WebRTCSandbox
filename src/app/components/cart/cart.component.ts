import {Component, Input} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})


export class CartComponent {
    @Input() OfferState: any;

    constructor(private api: ApiService) {}

    public addToCart() {
        this.api.addToCart(res => {
            alert('Здесь будет редирект');
        })
    }
}
