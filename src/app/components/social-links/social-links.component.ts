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

    public getShareLink() {
        this.shareLink = ' ';

        return this.apiService.shareSandbox(res => {
            return this.shareLink = environment.social.prefix + res.HashForLink;
        });
    }

    private openShareWindow(url, params) {
        this.apiService.shareSandboxToSocialMedia(this.shareLink, res => {
            window.open(url, '', params);
        });
    }

    public share() {

        window['FB'].ui(
            {
                method: 'feed',
                name: 'Facebook Dialogs',
                link: 'https://developers.facebook.com/docs/dialogs/',
                picture: 'http://fbrell.com/f8.jpg',
                caption: 'Reference Documentation',
                description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
            }
        );

        return false;
        /*this.getShareLink().then(() => {
            const fbShareUrl = this.shareLink + '&description=' + encodeURIComponent('Description will be here, also image. Coming soon.');

            this.openShareWindow('https://www.facebook.com/sharer/sharer.php?u=' + fbShareUrl, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        });

        return false;*/
    }

    public tweet() {
        window['twttr'].events.bind('tweet', event => {

        });
        /*this.getShareLink().then(() => {
            const tweetUrl = 'url=' + this.shareLink + '&text=' + encodeURIComponent('Some text will be here') + '&hashtags=tag1,tag2';
            this.openShareWindow('https://twitter.com/share?url=' + tweetUrl, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        });*/

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
