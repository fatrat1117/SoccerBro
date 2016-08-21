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
  team: any;
  logoData: any;
  logoUrl: any;

  constructor(private am: AccountManager,
    private navParams: NavParams,
    private nav: NavController) {
    this.tId = this.navParams.get('tId');
    this.busy = false;
    this.afTeam = this.am.afGetTeam(this.tId);
    this.team = {
      logo: '',
      name: '',
      description: ''
    };
  }

  changeLogo() {
    let self = this;
    self.busy = true;

    let success = data => {
      self.logoData = data;
      self.busy = false;
      self.logoUrl = "data:image/jpeg;base64," + data;
    }
    let error = err => {
      alert(err);
      self.busy = false;
    }
    this.am.selectImgGetData(success, error);
  }

  save() {
    console.log(this.team);
  }
}
