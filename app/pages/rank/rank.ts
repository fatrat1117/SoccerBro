import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/rank/rank.html'
})
export class RankPage {
  constructor(private navCtrl: NavController, private am : AccountManager) {

  }

  OnLogin() {
      this.am.facebook();
  }
}
