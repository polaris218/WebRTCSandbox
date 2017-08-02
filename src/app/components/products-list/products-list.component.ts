import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ProductModel} from "../../../../src/app/models/product.model";
import {environment} from "../../../environments/environment";

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
            this.OfferState = res;
        });
    }

    /**
     * TODO: пока что на скорую руку, потом уйти в строну геттера в модели
     *
     * */
    getDiscount(product) {
        if ( product.CutOffFlat > 0 ) {
            return product.Product.Price - product.CutOffFlat;
        }

        if ( product.CutOffPercent > 0 ) {
            return product.Product.Price * (100 - product.CutOffPercent) / 100;
        }

        return 0;
    }

    getImage(product) {


        return '/assets/img/product/product.png';
    }
}
