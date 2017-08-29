import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {ApiService} from "./services/api.service";
import {FilesListComponent} from "./components/files-list/files-list.component";
import {ProductsListComponent} from "./components/products-list/products-list.component";
import {Popup} from "./modules/popup/popup.module";
import {PopupService} from "./services/popup.service";
import {NgHide} from "./directives/ng-hide.directive";
import {UiSliderComponent} from "./components/_ui-components/ui-slider/ui-slider.component";
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface} from "angular2-perfect-scrollbar";
import {FilesControlsComponent} from "./components/files-controls/files-controls.component";
import {UploadService} from "./services/upload.service";
import {ServerService} from "./services/server.service";
import {SocketService} from "./services/socket.service";
import {NouisliderModule} from "ng2-nouislider";
import {SocialLinksComponent} from "./components/social-links/social-links.component";
import {CartComponent} from "./components/cart/cart.component";
import {LoaderComponent} from "./components/loader/loader.component";
import {MixDownPopup} from "./popups/mixdown-progress/mixdown-progress.popup";
import {LegendPopup} from "./popups/legend/legend.popup";
import {BasketPopup} from "./popups/basket/basket.popup";
import {ShareData} from "./state/share.data";
import {PageSliderModule} from 'ng2-page-slider';
import {ClipboardModule} from "ngx-clipboard/dist";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AppComponent,
        FilesListComponent,
        ProductsListComponent,
        UiSliderComponent,
        FilesControlsComponent,
        SocialLinksComponent,
        CartComponent,
        LoaderComponent,

        Popup,
        MixDownPopup,
        LegendPopup,
        BasketPopup,

        NgHide
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        NouisliderModule,
        PageSliderModule,
        ClipboardModule
    ],
    providers: [
        ServerService,
        ApiService,
        PopupService,
        SocketService,
        UploadService,
        ShareData
    ],
    entryComponents: [
        MixDownPopup,
        LegendPopup,
        BasketPopup
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
