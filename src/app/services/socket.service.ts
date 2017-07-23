import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {ServerService} from "./server.service";

@Injectable()
export class SocketService extends ServerService {
    private ws: WebSocket;

    constructor() {
        super();

        this.init();

        this.subScribeOnMessage();
    }

    init() {
        this.ws = new WebSocket(environment.socket.url);
    }

    send(data: any) {
        //let msg = this.dto.WebsocketMessage();
        this.ws.send(data);
    }

    subScribeOnMessage() {
        this.ws.onmessage = this.onMessage.bind(this);
    }

    onMessage(msg) {
        setInterval(() => {
            let arrayBuffer;
            let fileReader = new FileReader();
            let self = this;
            fileReader.onload = function() {
                arrayBuffer = this.result;
                let msg = self.dto.WebsocketMessage.decode(arrayBuffer);
                //console.dir(msg);
            };
            fileReader.readAsArrayBuffer(msg.data);
        });
    }
}

/*window.websocketSend = function() {
    window.ws.send(new window.WebsocketMessage({FirstFlag: true}).toBuffer());
};

window.ws.onmessage = function(evt) {
    console.log('Got message from server');

    var arrayBuffer;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        arrayBuffer = this.result;
        var msg = window.WebsocketMessage.decode(arrayBuffer);
        console.dir(msg);
    };
    fileReader.readAsArrayBuffer(evt.data);
};*/