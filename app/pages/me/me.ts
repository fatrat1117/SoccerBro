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
import {HomePage} from '../home/home';
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/me/me.html',
  pipes: [TeamBasicPipe, transPipe]
})
export class MePage {
  player: any;
  playerBasic: any;
  teamBasic: any;

  constructor(private nav: NavController, private modalController: ModalController, private am: AccountManager, private fm: FirebaseManager) {
    this.player = this.fm.getPlayerBasic(this.fm.selfId);
  }

  ionViewWillEnter() {
    let self = this;
    let success = () => {
      self.playerBasic = self.am.getCurrentPlayerSnapshot();
      if (self.playerBasic.teamId) {
        setTimeout(function () {
          self.fm.getTeamBasic(self.playerBasic.teamId).subscribe(snapshot => {
            console.log('me update team basic UI');
            self.teamBasic = snapshot;
          });
        }, 500);
      }
    }
    let error = err => self.am.showToast(err);
    this.am.setupListener(success, error);
    //do not subscribe one locatio more than once, the 2nd subscripiton will stop 1st subscripiton so that UI not updated.
    // this.player.subscribe(snapshot => {
    //   console.log('onSubscribe player basic');
    //   this.playerBasic = snapshot;
    // });
  }

  goTeamPage() {
    this.nav.push(MyTeamPage, {
      tId: this.fm.selfTeamId,
    });
  }

  onLogout() {
    this.am.logout();
    //location.reload();
  }

  showCreateTeamModel() {
    let modal = this.modalController.create(CreateTeamPage);
    modal.present();
  }

  goManageTeamPage() {
    this.nav.push(ManageTeamPage);
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

  pushPage() {
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.nav.push(HomePage, {
      id: "123",
      name: "Carl"
    });
  }
}
