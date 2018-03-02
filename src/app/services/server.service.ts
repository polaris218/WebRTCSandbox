import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class ServerService {
    public inited: boolean = false;
    public ProtoBuf: any;
    public builder: any;
    public dto: any = {};

    constructor() {


        const files = [
            'static/js/proto/Long.js',
            'static/js/proto/ByteBufferAB.js',
            'static/js/proto/ProtoBuf.js',
            'static/js/jquery.binarytransport.js'
        ];

        this.getProtoScript(files);
    }

    private getProtoScript(files) {
        if (files && files.length > 0) {
            const f = files.shift();

            const script = document.createElement('script');
            script.src = environment.api.host + f;
            script.type = 'text/javascript';

            script.onload = () => {
                this.getProtoScript(files);
            };

            script.onerror = () => {
                this.getProtoScript(files);
            };

            document.head.appendChild(script);
        } else {
            this.ProtoBuf = window['dcodeIO'].ProtoBuf;
            this.builder = this.ProtoBuf.newBuilder({convertFieldsToCamelCase: false});

            this.initProtoBuf();
        }
    }

    initProtoBuf() {
        const self = this;

        window['jQuery'].ajax({
            url: self.getUrl('static/protocol/SandboxPageSocketProto.json'),
            context: document.body
        }).done(function (data) {
            self.ProtoBuf.loadJson(JSON.stringify(data), self.builder);

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