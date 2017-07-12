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

@NgModule({
  declarations: [
    AppComponent,
    FilesListComponent,
    FileComponent,
    ProductsListComponent,
    ProductComponent,
    Popup,
    NgHide,
    TestPopup
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ApiService,
    PopupService
  ],
  entryComponents: [
      TestPopup
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
