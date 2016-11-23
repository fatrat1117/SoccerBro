import {Component} from '@angular/core';
import {NavController, ModalController, ViewController, NavParams} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager';
import {FirebaseManager} from '../../providers/firebase-manager';
import {SearchPlayerPage} from '../search-player/search-player';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {ManageNumberPage} from '../manage-number/manage-number';
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/edit-team/edit-team.html',
  pipes: [PlayerBasicPipe, transPipe]
})
export class EditTeamPage {
  busy: boolean;
  tId: any;
  afTeam: any;
  afTeamDetails: any;
  team: any;
  logoData: any;
  logoUrl: any;
  newCaptain: string;

  constructor(private am: AccountManager,
              navParams: NavParams,
              private nav: NavController,
              private fm : FirebaseManager,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController) {
    this.tId = navParams.get('tId');
    this.busy = false;
    this.afTeam = this.fm.getTeamBasic(this.tId);
    this.afTeamDetails = this.fm.getTeamDetail(this.tId);
    this.team = {
      tId: this.tId, 
      logo: '',
      name: '',
      description: ''
    };
    //this.newCaptain = '';
    
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

  managePlayerNumber() {
    this.modalCtrl.create(ManageNumberPage, { teamId: this.tId }).present();
  }

  searchPlayer() {
    let searchPlayerModal = this.modalCtrl.create(SearchPlayerPage, { teamId: this.tId, showDetail: false, showClose: true });
    searchPlayerModal.onDidDismiss(data => {
      if (data)
        this.newCaptain = data.playerId;
    });
    searchPlayerModal.present();
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
    if (this.newCaptain)
      teamObj["captain"] = this.newCaptain;

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
        this.am.updateImgGetUrl(this.logoData, this.tId, success, error);
    } else {
      self.saveTeam(self.team);
    }

    //console.log(this.team);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
