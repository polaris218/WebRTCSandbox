import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html'
})

/**
 * TODO:
 *  1. Написать компоненту, в которой будет происходить init ApiService и наследоваться от неё
 *
 * */

export class ProductsListComponent {
    initApiInterval: any = 0;
    productsList: any[];

    constructor(private api: ApiService) {
        this.checkIfApiInited();
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
            this.productsList = res.Offer.ProductList;
        });
    }
}
