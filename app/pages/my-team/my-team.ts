import {Component} from '@angular/core';
import {NavController, ModalController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";

@Component({
  templateUrl: 'build/pages/my-team/my-team.html'
})
export class MyTeamPage {

  //currentUser:any;
  afTeam: FirebaseObjectObservable<any>;

  constructor(private nav: NavController,
    private modalController: ModalController,
    private am: AccountManager,
    private navParams: NavParams) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();
    let tId = this.navParams.get('tId');
    this.afTeam = this.am.afGetTeam(tId || this.am.getCurrentTeamSnapshot().currentTeamId);
  }
}
