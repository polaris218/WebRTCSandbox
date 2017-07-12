import {Component, Input} from '@angular/core';
import {ProductModel} from "../../models/product.model";

@Component({
    selector: 'product',
    templateUrl: './product.component.html'
})

export class ProductComponent {
    @Input() product: ProductModel;
    @Input() productIndex: any;

    constructor() {

    }
}
