export class ProductModel {
    CutOffFlat: number;
    CutOffPercent: number;
    Product: any;

    constructor(params) {
        for (let i in params) {
            if (params.hasOwnProperty(i)) {
                this[i] = params[i];
            }
        }
    }
}