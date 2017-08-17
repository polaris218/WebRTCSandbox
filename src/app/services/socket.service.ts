import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {ServerService} from "./server.service";

@Injectable()
export class SocketService extends ServerService {
    private ws: WebSocket;
    public gpuServerLoad: any = {};

    constructor() {
        super();

        this.init();
    }

    init() {
        this.ws = new WebSocket(environment.socket.url);

        this.ws.onmessage = this.onMessage.bind(this);
    }

    onMessage(evt) {
        let arrayBuffer;
        let fileReader = new FileReader();
        let self = this;
        fileReader.onload = function() {
            arrayBuffer = this.result;
            self.gpuServerLoad = self.dto.SandboxPageSocketProto.decode(arrayBuffer);
            console.log(self);
        };
        fileReader.readAsArrayBuffer(evt.data);
    }

    getGpuServerLoad() {
        for (let i in this.gpuServerLoad.GpuServerLoad) {
            if (this.gpuServerLoad.GpuServerLoad.hasOwnProperty(i)) {
                this.gpuServerLoad.GpuServerLoad[i] = Math.round(this.gpuServerLoad.GpuServerLoad[i]);
            }
        }
        return this.gpuServerLoad.GpuServerLoad;
    }

    send(msg) {
        let data = new this.dto.SandboxPageSocketProto(msg).toBuffer();
        this.ws.send(data);
    }
}