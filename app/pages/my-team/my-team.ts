import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";

@Component({
  templateUrl: 'build/pages/my-team/my-team.html'
})
export class MyTeamPage {

  currentUser:any;
  currentTeam:FirebaseObjectObservable<any>;
  constructor(private nav: NavController, private modalController: ModalController, private am: AccountManager) {
    // this.currentTeam = this.am.getCurrentTeamSnapshot();

    this.am.afGetCurrentPlayer().subscribe(player => {
      console.log(player.teams);
      this.currentUser = player;
      if (this.currentUser.currentTeamId) {
        this.currentTeam = this.am.afGetTeam(this.currentUser.currentTeamId);
      }
    });
  }
}
