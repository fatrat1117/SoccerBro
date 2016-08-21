import {Component} from '@angular/core';
import {NavController, ModalController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {EditTeamPage} from '../edit-team/edit-team';

@Component({
  templateUrl: 'build/pages/my-team/my-team.html'
})
export class MyTeamPage {

  //currentUser:any;
  afTeam: FirebaseObjectObservable<any>;
  tId: any;

  constructor(private nav: NavController,
    private modalController: ModalController,
    private am: AccountManager,
    private navParams: NavParams) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();
    this.tId = this.navParams.get('tId') || this.am.getCurrentPlayerSnapshot().currentTeamId;
    this.afTeam = this.am.afGetTeam(this.tId);
  }

  editTeam() {
    this.nav.push(EditTeamPage,
      {
        tId: this.tId
      }
    );
  }
}
