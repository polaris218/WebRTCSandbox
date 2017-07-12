import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiService {
    /**
     * TODO:
     * 1. Переделать init
     * 2. jQuery и jQueryBinary использовать в качестве ts модулей. Ну или просто прийти к работе с промисами, без callback
     * 3.
     *
     * */
    public inited: boolean = false;
    public ProtoBuf: any;
    public builder: any;
    public dto: any = {
        RequestMessage: Object,
        ResponseMessage: Object,
        WebsocketMessage: Object,
        CartOfferRqDto: Object,
        CartOfferRsDto: Object,
        SandboxStateRqDto: Object,
        SandboxStateRsDto: Object,
        BounceCounterRqDto: Object,
        BounceCounterRsDto: Object,
        StorageLimitsRsDto: Object
    };

    constructor() {
        this.ProtoBuf = window['dcodeIO'].ProtoBuf;
        this.builder = this.ProtoBuf.newBuilder({convertFieldsToCamelCase: false});

        this.initProtoBuf();
    }

    initProtoBuf() {
        const self = this;

        const secondInitStep = () => {
            window['jQuery'].ajax({
                url: self.getUrl('static/protocol/ProductSandbox.json'),
                context: document.body
            }).done(function (data) {
                self.ProtoBuf.loadJson(JSON.stringify(data), self.builder);
                self.dto['CartOfferRqDto'] = self.builder.build('CartOfferRqDto');
                self.dto['CartOfferRsDto'] = self.builder.build('CartOfferRsDto');
                self.dto['SandboxStateRqDto'] = self.builder.build('SandboxStateRqDto');
                self.dto['SandboxStateRsDto'] = self.builder.build('SandboxStateRsDto');
                self.dto['BounceCounterRqDto'] = self.builder.build('BounceCounterRqDto');
                self.dto['BounceCounterRsDto'] = self.builder.build('BounceCounterRsDto');
                self.dto['StorageLimitsRsDto'] = self.builder.build('StorageLimitsRsDto');

                self.inited = true;

                //console.log(self.getQuery('http://localhost:3005/service/bo/ProductSandbox/GetSandboxState/', {SandboxHash: "abcdef"}, self.dto['SandboxStateRsDto']));
                //self.getQuery('http://localhost:3005/service/bo/ProductSandbox/GetSandboxState/', {SandboxHash: "abcdef"}, app['SandboxStateRsDto']);
            });
        };

        window['jQuery'].ajax({
            url: self.getUrl('static/js/proto/Example.json'),
            context: document.body
        }).done(function (data) {
            self.ProtoBuf.loadJson(JSON.stringify(data), self.builder);
            self.dto['RequestMessage'] = self.builder.build('GetRqProto');
            self.dto['ResponseMessage'] = self.builder.build('GetRsProto');
            self.dto['WebsocketMessage'] = self.builder.build('WebsocketProto');

            secondInitStep();
        });
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
                    cb(rsType.decode(data));
                }
                //return JSON.stringify(rsType.decode(data));
                //alert('Got response from server: ' + JSON.stringify(resp));
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
                    cb(rsType.decode(data));
                }
                //var resp = rsType.decode(data);
                //alert('Got response from server: ' + JSON.stringify(resp));
            }
        });
    }

    private getUrl(url: string) {
        return environment.api.host + url;
    }

    public GetSandboxState(cb: any) {
        return this.getQuery('service/bo/ProductSandbox/GetSandboxState/', {SandboxHash: "abcdef"}, this.dto['SandboxStateRsDto'], cb);
    }

    getCartOffer(cb: any) {
        const p1 = {Id: 'd_lay'};
        const p2 = {Id: 'flangeman'};
        const msg = {Products: [p1, p2]};

        return this.postQuery('service/bo/ProductSandbox/CartOffer/', msg, this.dto['CartOfferRqDto'], this.dto['CartOfferRsDto'], cb);
    }

    public isInited() {
        return this.inited;
    }
}