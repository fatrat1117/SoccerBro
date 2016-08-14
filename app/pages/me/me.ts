import {Component} from '@angular/core';
import {NavController, NavParams, Modal} from 'ionic-angular';
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
  defaultTeam: FirebaseObjectObservable<any>;
  player: any;
  //defaultTeam: any;

  constructor(private nav: NavController, private am: AccountManager) {
    let self = this;
    this.am.afGetCurrentPlayer().subscribe(_ => {
      console.log("current player data changed, update me UI");
      self.player = this.am.getCurrentPlayerSnapshot();
      if (self.player.currentTeamId)
        self.defaultTeam = this.am.afGetTeam(self.player.currentTeamId);
    });
  }

  openNavTeamPage() {
    this.nav.push(MyTeamPage);
  }

  onLogout() {
    this.am.logout();
  }

  showCreateTeamModel() {
      let page = Modal.create(CreateTeamPage);
      this.nav.present(page);
  }

  goManageTeamPage() {
    this.nav.push(ManageTeamPage, {
      id: this.am.currentUser.uid,
    });
  }
}
