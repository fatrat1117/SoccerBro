import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MyTeamPage} from '../my-team/my-team';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/me/me.html'
})
export class MePage {
  //items = [];

  constructor(private nav: NavController, private am : AccountManager) {

  }

  openNavTeamPage(){
    this.nav.push(MyTeamPage);
  }

  onLogout() {
      this.am.logout();
  }
}
