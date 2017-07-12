import {Directive, Input, ViewContainerRef} from "@angular/core";

@Directive({
    selector: '[ngHide]'
})
export class NgHide {
    private display: string;

    @Input('ngHide')
    set ngHide(hide: boolean) {
        this.viewContainerRef.element.nativeElement.style.display = hide ? 'none' : this.display;
    };

    constructor(public viewContainerRef: ViewContainerRef) {
        this.display = this.viewContainerRef.element.nativeElement.style.display;
    }
}