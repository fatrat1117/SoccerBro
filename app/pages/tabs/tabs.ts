import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {AboutPage} from '../rank/rank';
import {ContactPage} from '../message/message';
import {MyPage} from '../me/me';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
    this.tab4Root = MyPage;
  }
}
