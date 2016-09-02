import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';

@Component({
  templateUrl: 'build/pages/my-player/my-player.html'
})
export class MyPlayerPage {
  pId: any;
  //af
  afBasic: any;
  afDetail: any;
  afPublic: any;

  constructor(private nav: NavController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    this.pId = this.navParams.get('pId');
    this.afBasic = this.fm.getPlayerBasic(this.pId);
    this.afDetail = this.fm.getPlayerDetail(this.pId);
    this.afPublic = this.fm.getPlayerPublic(this.pId);
    this.fm.increasePopularity(this.afPublic);
  }

  // editTeam() {
  //   this.nav.push(EditTeamPage,
  //     {
  //       tId: this.tId
  //     }
  //   );
  // }

  // getTeamAvatar(src){
  //   var image = new Image();
  //   image.src = src
  //   return image;
  // }

  // goManagePlayerPage() {
  //   this.nav.push(ManagePlayerPage, {tId: this.tId});
  // }
}
