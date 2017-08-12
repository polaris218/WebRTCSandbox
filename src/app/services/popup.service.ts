import {Injectable, Type} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import {popupState} from "../interface";

@Injectable()
export class PopupService {
    private subject: Subject<any>;
    private keyDownSubscribe: Subscription;
    private stateChangeSubscribe: Subscription;
    public state: popupState = { show: false };

    constructor() {}

    open(component: Type<any>, data?: any) {
        this.show(component, data);
        return this.subject;
    }

    resolve(value?: any) {
        this.subject.next(value);
        this.close();
    }

    /**
     * В отличие от close() завершает Observable с ошибкой
     *
     */
    reject(error?: any) {
        this.subject.error(error);
        this.hide();
    }

    /**
     * В отличие от reject() завершает Observable без ошибки
     *
     */
    close() {
        this.subject.complete();
        this.hide();
    }

    private onStateChange() {
        this.state.show && this.close();
    }

    private onKeyDown(event: KeyboardEvent) {
        const code = event.keyCode || event.which;
        code === 27 && this.close();
    }

    private show(component: Type<any>, data?: any) {
        this.subject = new Subject();
        this.setPopupState({
            show: true,
            component,
            data
        });
    }

    private hide() {
        //this.keyDownSubscribe.unsubscribe();
        //this.stateChangeSubscribe.unsubscribe();
        this.setPopupState({
            show: false
        });
    }

    private setPopupState(state: popupState) {
        this.state = state;
    }
}