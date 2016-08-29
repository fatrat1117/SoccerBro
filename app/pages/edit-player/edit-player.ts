import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager';
import {FirebaseManager} from '../../providers/firebase-manager';

@Component({
  templateUrl: 'build/pages/edit-player/edit-player.html'
})
export class EditPlayerPage {
 busy: boolean;
  pId: any;
   afPlayerBasic: any;
   afPlayerDetail: any;
   player: any;
   logoData: any;
   logoUrl: any;

  constructor(private am: AccountManager,
    private navParams: NavParams,
    private nav: NavController,
    private fm : FirebaseManager) {
     this.pId = this.navParams.get('pId');
     this.busy = false;
     this.afPlayerBasic = this.fm.getPlayerBasic(this.pId);
     this.afPlayerDetail = this.fm.getPlayerDetail(this.pId);
    this.player = {
      pId: this.pId, 
      photo: '',
      name: '',
      weight:'',
      height:'',
      foot:'',
      position:'',
      description: ''
    };
  }

  changePhoto() {
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

  savePlayer(obj) {
    //console.log(obj);
    
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
    this.fm.updatePlayer(obj, success, error);
  }

  save() {
    let self = this;
    this.busy = true;
    if (this.logoData) {
        let success = imgUrl => {
            self.player.photo = imgUrl;
            self.savePlayer(self.player);
        }

        let error = err => alert(err);
        this.am.updateImgGetUrl(this.logoData, success, error);
    } else {
      self.savePlayer(self.player);
    }

    //console.log(this.team);
  }
}
