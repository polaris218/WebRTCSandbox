import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UploadService {
    public progress: any;
    public progressObserver: any;

    constructor() {
        this.progress = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    uploadFiles(files: File[]) {
        const url = 'http://localhost:3005/upload';

        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                this.progressObserver.next(this.progress);
            };

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}

/*import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Rx';

declare var $: any;

@Injectable()
export class HttpClient {
    requestUrl: string;
    responseData: any;
    handleError: any;

    constructor(private router: Router,
                private http: Http) {
        this.http = http;
    }

    postWithFile(url: string, postData: any, files: File[]) {

        let headers = new Headers();
        let formData: FormData = new FormData();
        formData.append('files', files[0], files[0].name);
        // For multiple files
        // for (let i = 0; i < files.length; i++) {
        //     formData.append(`files[]`, files[i], files[i].name);
        // }

        if (postData !== "" && postData !== undefined && postData !== null) {
            for (var property in postData) {
                if (postData.hasOwnProperty(property)) {
                    formData.append(property, postData[property]);
                }
            }
        }
        var returnReponse = new Promise((resolve, reject) => {
            this.http.post(url, formData, {
                headers: headers
            }).subscribe(
                res => {
                    this.responseData = res.json();
                    resolve(this.responseData);
                },
                error => {
                    this.router.navigate(['/login']);
                    reject(error);
                }
            );
        });
        return returnReponse;
    }
}*/


/*import {Injectable} from '@angular/core';
 import {Observable} from 'rxjs/Rx';

 @Injectable()
 export class UploadService {
 public progress: any;
 public progressObserver: any;

 constructor() {
 this.progress = Observable.create(observer => {
 this.progressObserver = observer
 }).share();
 }

 private makeFileRequest(url: string, params: string[], files: File[]) {
 return Observable.create(observer => {
 let formData: FormData = new FormData(),
 xhr: XMLHttpRequest = new XMLHttpRequest();

 for (let i = 0; i < files.length; i++) {
 formData.append("uploads[]", files[i], files[i].name);
 }

 xhr.onreadystatechange = () => {
 if (xhr.readyState === 4) {
 if (xhr.status === 200) {
 observer.next(JSON.parse(xhr.response));
 observer.complete();
 } else {
 observer.error(xhr.response);
 }
 }
 };

 xhr.upload.onprogress = (event) => {
 this.progress = Math.round(event.loaded / event.total * 100);

 this.progressObserver.next(this.progress);
 };

 xhr.open('POST', url, true);
 xhr.send(formData);
 });
 }
 }*/