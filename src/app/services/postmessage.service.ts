import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class PostMessageService {
    private msg: any;

    constructor() {
        this.subscribe();
    }

    public sendMessage(msg) {
        window.frames[0].postMessage(JSON.stringify(msg), '*');
    }

    private subscribe() {
        window.addEventListener('message', msg => {
            this.msg = msg;
        });
    }

    private checkPmOrigin(msg) {
        return environment.postmessage.origin.indexOf(msg.origin) >= 0;
    }

    public getMessage() {
        return this.msg;
    }
}