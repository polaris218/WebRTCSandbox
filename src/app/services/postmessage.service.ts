import {Injectable, EventEmitter} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class PostMessageService {
    private msg: any;

    public onMessage: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.subscribe();
    }

    public sendMessage(msg) {
        window.frames['myIframe'].contentWindow.postMessage(JSON.stringify(msg), '*');
    }

    private subscribe() {
        window.addEventListener('message', msg => {
            try {
                this.msg = JSON.parse(msg.data);

                this.onMessage.emit(this.msg);
            } catch(err) {}
        });
    }

    private checkPmOrigin(msg) {
        return environment.postmessage.origin.indexOf(msg.origin) >= 0;
    }

    public getMessage() {
        return this.msg;
    }
}