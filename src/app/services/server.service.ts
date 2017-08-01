import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class ServerService {
    public inited: boolean = false;
    public ProtoBuf: any;
    public builder: any;
    public dto: any = {
        SandboxPageSocketProto: Object,
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

        window['jQuery'].ajax({
            url: self.getUrl('static/protocol/SandboxPageSocketProto.json'),
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
            self.dto['SandboxPageSocketProto'] = self.builder.build('SandboxPageSocketProto');

            self.inited = true;
        });
    }

    getUrl(url: string) {
        return environment.api.host + url;
    }
}