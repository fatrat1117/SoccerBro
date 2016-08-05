import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/create-team/create-team.html'
})
export class CreateTeamPage {
  teamName: any;
  location: any;
  busy: boolean;
  constructor(private viewCtrl: ViewController,
    private am: AccountManager) {
    this.busy = false;
    this.location = 'SG';
    this.teamName = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doCancel() {
    this.dismiss();
  }

  doCreateTeam() {
    let teamObj = {
      name: this.teamName.trim(),
      location: this.location
    };
    this.busy = true;
    try {
      this.am.createTeam(teamObj);
    }
    catch (e) {
      this.busy = false;
      alert(e);
    }
  }
}
