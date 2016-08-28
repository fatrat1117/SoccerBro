import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager';
import {FirebaseManager} from '../../providers/firebase-manager';

@Component({
  templateUrl: 'build/pages/edit-player/edit-player.html'
})
export class EditPlayerPage {
  busy: boolean;
  tId: any;
  afTeam: any;
  afTeamDetails: any;
  team: any;
  logoData: any;
  logoUrl: any;

  constructor(private am: AccountManager,
    private navParams: NavParams,
    private nav: NavController,
    private fm : FirebaseManager) {
    this.tId = this.navParams.get('tId');
    this.busy = false;
    this.afTeam = this.fm.getTeamBasic(this.tId);
    this.afTeamDetails = this.fm.getTeamDetail(this.tId);
    this.team = {
      tId: this.tId, 
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

  saveTeam(teamObj) {
    let self = this;
    let success = _ => {
      self.nav.pop();
      //self.team.logo = self.team.name = self.team.description = '';
      //self.busy = false;
    }
    let error = err => {
      alert(err);
      self.busy = false;
    }
    this.am.updateTeam(teamObj, success, error);
  }

  save() {
    let self = this;
    this.busy = true;
    if (this.logoData) {
        let success = imgUrl => {
            self.team.logo = imgUrl;
            self.saveTeam(self.team);
        }

        let error = err => alert(err);
        this.am.updateImgGetUrl(this.logoData, success, error);
    } else {
      self.saveTeam(self.team);
    }

    //console.log(this.team);
  }
}
