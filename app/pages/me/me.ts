import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import { FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager'
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';
import {ManageTeamPage} from '../manage-team/manage-team';
import {EditPlayerPage} from '../edit-player/edit-player';
import {MyPlayerPage} from '../my-player/my-player';
import {FeedbackPage} from '../feedback/feedback';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';

@Component({
  templateUrl: 'build/pages/me/me.html'
})
export class MePage {
  defaultTeam: any;
  player: any;
  //defaultTeam: any;
  afPlayer: any;
  showMyTeam = false;
  showCreateTeam = false;

  constructor(private nav: NavController, private modalController: ModalController, private am: AccountManager) {
    let self = this;
    this.afPlayer = am.afGetCurrentPlayer();
    this.afPlayer.subscribe(snapshot => {
      self.player = snapshot;
      console.log("current player data changed, update me UI", snapshot);
      if (self.player.teamId) {
        self.showMyTeam = true;
        self.showCreateTeam = false;
      } else {
        self.showMyTeam = false;
        self.showCreateTeam = true;
      }
      self.defaultTeam = self.am.afGetTeam(self.player.teamId);
    });
  }

  goTeamPage() {
    //console.log(this.player);
    if (this.player && this.player.teamId) {
      //console.log(this.player.teamId);
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
      pId: this.am.currentUser.uid,
    });
  }

  goEditPlayerPage() {
    this.nav.push(EditPlayerPage, {
      pId: this.am.currentUser.uid,
    });
  }

  goPlayerPage() {
    this.nav.push(MyPlayerPage, {
      pId: this.am.currentUser.uid,
    });
  }

  goFeedbackPage() {
    this.nav.push(FeedbackPage);
  }
}
