import {Type} from "@angular/core";

export interface popupState {
    show: boolean
    component?: Type<any>
    data?: any
}