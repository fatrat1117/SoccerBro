import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MyTeamPage} from '../my-team/my-team';
import {AccountManager} from '../../providers/account-manager'
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/me/me.html'
})
export class MePage {
  player: FirebaseObjectObservable<any>;

  constructor(private nav: NavController, private am: AccountManager, private af: AngularFire) {
    let user = this.am.getUser();
    let pRef = this.am.getCurrentPlayerRef();
    console.log(pRef);

    this.player = this.af.database.object(this.am.getCurrentPlayerRef());
  }

  openNavTeamPage() {
    this.nav.push(MyTeamPage);
  }

  onLogout() {
    this.am.logout();
  }
}
