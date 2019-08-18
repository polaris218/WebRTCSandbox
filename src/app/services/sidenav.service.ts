import { Injectable } from '@angular/core';

@Injectable()
export class SidenavService {
  public hideSideNav_left: boolean = false;
  public hideSideNav_right: boolean = false;


  constructor() { }

  toggleSideNav_left(): void {
    console.log('leftsidebasr');
    this.hideSideNav_left = !this.hideSideNav_left;
  }
  toggleSideNav_right(): void {
    console.log('rightsidebasr');
    this.hideSideNav_right = !this.hideSideNav_right;
  }

}
