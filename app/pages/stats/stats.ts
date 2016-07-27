import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/stats/stats.html'
})
export class StatsPage {
  stats: string = "team";
  constructor(private navCtrl: NavController, private am : AccountManager) {
  }
}
