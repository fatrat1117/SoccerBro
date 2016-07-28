import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {StatsPage} from '../stats/stats';
import {MessagePage} from '../message/message';
import {MePage} from '../me/me';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor(private am : AccountManager, private nav: NavController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = StatsPage;
    this.tab3Root = MessagePage;
    this.tab4Root = MePage;
  }

  checkLogin() {
    this.am.checkLogin(this.nav);
  }
}
