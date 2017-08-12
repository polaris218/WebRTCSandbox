import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {ServerService} from "./server.service";

@Injectable()
export class ApiService extends ServerService {
    constructor() {
        super();
    }

    private getQuery(uri, msg, rsType, cb) {
        return window['jQuery'].ajax({
            url: this.getUrl(uri),
            type: "GET",
            dataType: 'binary',
            headers: {'Content-Type': 'application/x-protobuf'},
            data: msg,
            processData: false,
            responseType: 'arraybuffer',
            success: function (data) {
                if (typeof cb === 'function') {
                    //console.log(rsType.decode(data));
                    cb(rsType.decode(data));
                }
            }
        });
    }

    private postQuery(uri, msg, rqType, rsType, cb) {
        const rq = new rqType(msg).toBuffer();

        return window['jQuery'].ajax({
            url: this.getUrl(uri),
            type: "POST",
            dataType: 'binary',
            headers: {'Content-Type': 'application/x-protobuf'},
            data: rq,
            processData: false,
            responseType: 'arraybuffer',
            success: function (data) {
                if (typeof cb === 'function') {
                    //console.log(rsType.decode(data));
                    cb(rsType.decode(data));
                }
            }
        });
    }

    public GetSandboxState(cb: any) {
        return this.getQuery(
            'service/bo/ProductSandbox/GetSandboxState/',
            {SandboxHash: "abcdef"},
            this.dto['SandboxStateRsDto'],
            cb
        );
    }

    public getCartOffer(cb: any) {
        const p1 = {Id: 'd_lay'};
        const p2 = {Id: 'flangeman'};
        const msg = {Products: [p1, p2]};

        return this.postQuery(
            'service/bo/ProductSandbox/CartOffer/',
            msg,
            this.dto['CartOfferRqDto'],
            this.dto['CartOfferRsDto'],
            cb
        );
    }

    public getSocialMediaLinks(cb: any) {
        const msg = {
            CurrentSandboxHash: 'ASDF123',
            SocialMediaLink: 'facebook'
        };

        return this.postQuery(
            'service/bo/ProductSandbox/LinkSandboxToSocialMedia/',
            msg,
            this.dto['LinkSandboxToSocialMediaRqDto'],
            this.dto['LinkSandboxToSocialMediaRsDto'],
            cb
        );
    }

    public shareSandbox(cb: any) {
        return this.postQuery(
            'service/bo/ProductSandbox/ShareSandbox/',
            {},
            this.dto['ShareSandboxRqDto'],
            this.dto['ShareSandboxRsDto'],
            cb
        );
    }

    public addToCart(cb: any) {
        const p1 = {Id: 'd_lay'};
        const p2 = {Id: 'flangeman'};
        const msg = {Products: [p1, p2]};

        return this.postQuery(
            'service/bo/ProductSandbox/AddToCart',
            msg,
            this.dto['CartOfferRqDto'],
            this.dto['AddToCartRsDto'],
            cb
        );
    }

    public isInited() {
        return this.inited;
    }
}