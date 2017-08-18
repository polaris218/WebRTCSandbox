import {Component} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'social-links',
    templateUrl: './social-links.component.html'
})


export class SocialLinksComponent {
    public shareLink: string = '';

    constructor(private apiService: ApiService) {}

    private getShareLink() {
        this.shareLink = '';

        return this.apiService.shareSandbox(res => {
            return this.shareLink += environment.social.prefix + res.HashForLink;
        });
    }

    private openShareWindow(url, params) {
        this.apiService.shareSandboxToSocialMedia(this.shareLink, res => {
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
