import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {ServerService} from "./server.service";

@Injectable()
export class SocketService extends ServerService {
    private ws: WebSocket;
    public socketData: any = {};

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
            self.socketData = self.dto.SandboxPageSocketProto.decode(arrayBuffer);
            //console.log(self);
        };
        fileReader.readAsArrayBuffer(evt.data);
    }

    getSocketData() {
        //console.log(this.socketData);
        return this.socketData;
    }

    send(msg) {
        let data = new this.dto.SandboxPageSocketProto(msg).toBuffer();
        this.ws.send(data);
    }
}