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
      location: this.location,
      isDefault: true
    };

    this.busy = true;
    let self = this;

    let success = function () {
      self.dismiss();
    }

    let error = function (e) {
      self.busy = false;
      alert(e);
    }
    this.am.createTeam(teamObj, success, error);
  }
}
