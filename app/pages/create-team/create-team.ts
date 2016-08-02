import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/my-team/my-team.html'
})
export class MyTeamPage {
  teamName : any;
  location : any;
  busy : boolean;
  constructor(private viewCtrl: ViewController,
              private am: AccountManager) {
    this.busy = false;
  }

  dismiss() {
        this.viewCtrl.dismiss();
    }

  doCancel() {
    this.dismiss();
  }

  doCreateTeam() {
    let teamObj = {name : this.teamName.trim(),
      location: this.location};
      this.busy = true;
      this.am.createTeam(teamObj);
  }
}
