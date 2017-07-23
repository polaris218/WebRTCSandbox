import {CommonModule} from "@angular/common";
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {ApiService} from "./services/api.service";
import {FilesListComponent} from "./components/files-list/files-list.component";
import {FileComponent} from "./components/file/file.component";
import {ProductsListComponent} from "./components/products-list/products-list.component";
import {ProductComponent} from "./components/product/product.component";
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

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    FilesListComponent,
    FileComponent,
    ProductsListComponent,
    ProductComponent,
    Popup,
    NgHide,
    TestPopup,
    FileUploadPopup,
    UiSliderComponent,
    FilesControlsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)
  ],
  providers: [
    ApiService,
    PopupService,
    UploadService
  ],
  entryComponents: [
    TestPopup,
    FileUploadPopup
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
