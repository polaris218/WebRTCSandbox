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

            console.log('Proto JSON: ', data);

            data.messages.forEach(type => {
                self.dto[type.name] = self.builder.build(type.name);
            });

            self.inited = true;
        });
    }

    getUrl(url: string) {
        return environment.api.host + url;
    }
}