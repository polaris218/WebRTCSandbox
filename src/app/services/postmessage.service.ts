import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class PostMessageService {
    constructor() {
        this.subscribe();
    }

    public sendMessage(target, msg, origin) {
        target.postMessage(JSON.stringify(msg), origin);
    }

    private subscribe() {
        window.addEventListener('message', msg => {
            if (this.checkPmOrigin(msg)) {

            }
        });
    }

    private checkPmOrigin(msg) {
        return environment.postmessage.origin.indexOf(msg.origin) >= 0;
    }
}