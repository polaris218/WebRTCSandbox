import {Component, EventEmitter, Output} from "@angular/core";
import {PopupService} from "./services/popup.service";
import {TestPopup} from "./popups/popup-test/popup-test.content";
import {LoadState} from "./state/load.state";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    private rejected: boolean = false;
    protected rejectState = new LoadState();
    protected submitState = new LoadState();

    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @Output() onReject: EventEmitter<any> = new EventEmitter();

    constructor(private popupService: PopupService) {
    }

    openPopup() {
        this.popupService.open(TestPopup, {})
            .subscribe(() => {
                this.rejected = true;
                this.onReject.emit();
            });
    }
}
