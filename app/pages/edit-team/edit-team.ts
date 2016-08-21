import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager';

@Component({
  templateUrl: 'build/pages/edit-team/edit-team.html'
})
export class EditTeamPage {
  busy: boolean;
  tId: any;
  afTeam: any;

  constructor(private am: AccountManager,
    private navParams: NavParams,
    private nav: NavController) {
    this.tId = this.navParams.get('tId');
    this.busy = false;
    this.afTeam = this.am.afGetTeam(this.tId);
    //console.log(this.tId, this.afTeam)
  }
}
