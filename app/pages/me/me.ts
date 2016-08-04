import {Component} from '@angular/core';
import {NavController, NavParams, Modal} from 'ionic-angular';
import {AccountManager} from '../../providers/account-manager'
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';

@Component({
  templateUrl: 'build/pages/me/me.html'
})
export class MePage {
  player: FirebaseObjectObservable<any>;
  defaultTeam: FirebaseObjectObservable<any>;

  constructor(private nav: NavController, private am: AccountManager, private af: AngularFire) {
    var self = this;
    let user = this.am.getUser();
    let pRef = this.am.getCurrentPlayerRef();
    console.log(pRef);

    this.player = this.af.database.object(this.am.getCurrentPlayerRef());
    let playerSnapshot = this.af.database.object(this.am.getCurrentPlayerRef(), { preserveSnapshot: true });
    playerSnapshot.subscribe(snapshot => {
      //console.log(snapshot.key)
      let val = snapshot.val();
      console.log(val);
      self.defaultTeam = self.af.database.object(self.am.getTeamRef(val.currentTeamId));
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
}
