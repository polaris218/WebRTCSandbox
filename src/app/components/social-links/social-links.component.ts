import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ProductModel} from "../../../../src/app/models/product.model";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'social-links',
    templateUrl: './social-links.component.html'
})


export class SocialLinksComponent {
    private initApiInterval: any = 0;
    public shareLink: string = '';

    constructor(private api: ApiService) {
        this.checkIfApiInited();
    }

    checkIfApiInited() {
        clearInterval(this.initApiInterval);

        this.initApiInterval = window.setInterval(() => {
            if (this.api.isInited()) {


                clearInterval(this.initApiInterval);
            }
        }, 250);
    }

    private getShareLink() {
        return this.api.shareSandbox(res => {
            return this.shareLink += environment.social.prefix + res.HashForLink;
        });
    }

    private openShareWindow(url, params) {
        this.api.shareSandboxToSocialMedia(this.shareLink, res => {
            window.open(url, '', params);
        });
    }

    public share() {
        this.getShareLink().then(() => {
            const fbShareUrl = this.shareLink + '&description=' + encodeURIComponent('Description will be here, also image. Coming soon.');

            this.openShareWindow('https://www.facebook.com/sharer/sharer.php?u=' + fbShareUrl, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        });


        return false;
    }

    public tweet() {
        this.getShareLink().then(() => {
            const tweetUrl = 'url=' + this.shareLink + '&text=' + encodeURIComponent('Some text will be here') + '&hashtags=tag1,tag2';
            this.openShareWindow('https://twitter.com/share?url=' + tweetUrl, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        });

        return false;
    }

    public copyLink() {
        this.getShareLink().then(() => {
            if (window.getSelection) {
                let range = document.createRange();
                range.selectNode(document.getElementById('copyLink'));
                window.getSelection().addRange(range);
                document.execCommand("Copy");
            }
        });
    }
}
