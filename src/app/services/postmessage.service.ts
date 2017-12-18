import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable()
export class PostMessageService {
    private msg: any;

    constructor() {
        this.subscribe();
    }

    public sendMessage(targetName, msg, origin) {
        console.log('targetName: ', targetName);
        window.frames[targetName].postMessage(JSON.stringify(msg), origin);
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