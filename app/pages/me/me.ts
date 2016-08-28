import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import { FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager'
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';
import {ManageTeamPage} from '../manage-team/manage-team';

@Component({
  templateUrl: 'build/pages/me/me.html'
})
export class MePage {
  //player: FirebaseObjectObservable<any>;
  defaultTeam: any;
  player: any;
  //defaultTeam: any;

  constructor(private nav: NavController, private modalController: ModalController, private am: AccountManager) {
    let self = this;
    this.am.afGetCurrentPlayer().subscribe(_ => {
      self.player = this.am.getCurrentPlayerSnapshot();
      //console.log("current player data changed, update me UI", self.player);
      if (self.player.teamId)
        self.defaultTeam = self.am.afGetTeam(self.player.teamId);
    });
  }

  openNavTeamPage() {
    this.nav.push(MyTeamPage, {
      //Hard code Team ID
      tId: "-KL1a8zTfCXDapavsN_L",
    });
  }

  onLogout() {
    this.am.logout();
  }

  showCreateTeamModel() {
    let modal = this.modalController.create(CreateTeamPage);
    modal.present();
  }

  goManageTeamPage() {
    this.nav.push(ManageTeamPage, {
      id: this.am.currentUser.uid,
    });
  }
}
