import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager'
import {FirebaseManager} from '../../providers/firebase-manager'
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';
import {ManageTeamPage} from '../manage-team/manage-team';
import {EditPlayerPage} from '../edit-player/edit-player';
import {MyPlayerPage} from '../my-player/my-player';
import {FeedbackPage} from '../feedback/feedback';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';

@Component({
  templateUrl: 'build/pages/me/me.html',
  pipes: [TeamBasicPipe]
})
export class MePage {
  player: any;

  constructor(private nav: NavController, private modalController: ModalController, private am: AccountManager, private fm: FirebaseManager) {
    this.player = fm.getPlayerBasic(fm.selfId);
  }

  goTeamPage() {
    this.nav.push(MyTeamPage, {
      tId: this.fm.selfTeamId,
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
      pId: this.fm.selfId
    });
  }

  goEditPlayerPage() {
    this.nav.push(EditPlayerPage, {
      pId: this.fm.selfId
    });
  }

  goPlayerPage() {
    this.nav.push(MyPlayerPage, {
      pId: this.fm.selfId
    });
  }

  goFeedbackPage() {
    this.nav.push(FeedbackPage);
  }
}
