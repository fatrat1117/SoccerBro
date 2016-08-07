import {Component} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager';

@Component({
  templateUrl: 'build/pages/manage-team/manage-team.html'
})
export class ManageTeamPage {
  teams: any;
  busy: boolean;

  constructor(private am: AccountManager, private af: AngularFire) {
    this.busy = false;
    this.teams = [];
    //let teamsOfPlayer = this.af.database.object(this.am.getCurrentPlayerRef());
  }

  migrateOldData() {
    let players = this.af.database.object('/players');
    players.subscribe(ps => {
      ps.foreach(p => {
        console.log(p);
      })
    })
  }
}
