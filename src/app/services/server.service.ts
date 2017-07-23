import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class ServerService {
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

    getUrl(url: string) {
        return environment.api.host + url;
    }
}