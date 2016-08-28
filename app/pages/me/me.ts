import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import { FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager'
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';
import {ManageTeamPage} from '../manage-team/manage-team';
import {EditPlayerPage} from '../edit-player/edit-player';

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
    if (this.player && this.player.teamId) {
      this.nav.push(MyTeamPage, {
        //Hard code Team ID
        tId: this.player.teamId,
      });
    }
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

  goEditPlayerPage() {
    this.nav.push(EditPlayerPage, {
      pId: this.am.currentUser.uid,
    });
  }
}
