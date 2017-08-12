import {CommonModule} from "@angular/common";
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ApiService} from "./services/api.service";
import {FilesListComponent} from "./components/files-list/files-list.component";
import {ProductsListComponent} from "./components/products-list/products-list.component";
import {Popup} from "./modules/popup/popup.module";
import {PopupService} from "./services/popup.service";
import {NgHide} from "./directives/ng-hide.directive";
import {TestPopup} from "./popups/popup-test/popup-test.content";
import {UiSliderComponent} from "./components/_ui-components/ui-slider/ui-slider.component";
import {FileUploadPopup} from "./popups/file-upload-popup/file-upload-popup";
import {PerfectScrollbarModule} from 'angular2-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'angular2-perfect-scrollbar';
import {FilesControlsComponent} from "./components/files-controls/files-controls.component";
import {UploadService} from "./services/upload.service";
import {ServerService} from "./services/server.service";
import {SocketService} from "./services/socket.service";
import {NouisliderModule} from "ng2-nouislider";
import {SocialLinksComponent} from "./components/social-links/social-links.component";
import {CartComponent} from "./components/cart/cart.component";
import {LoaderComponent} from "./components/loader/loader.component";

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
    TestPopup,
    FileUploadPopup,

    NgHide
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    NouisliderModule
  ],
  providers: [
    ServerService,
    ApiService,
    PopupService,
    SocketService,
    UploadService
  ],
  entryComponents: [
    TestPopup,
    FileUploadPopup
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
