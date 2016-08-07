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
    let players = this.af.database.list('/players');
    players.subscribe(ps => {
      ps.forEach(p => {
        for (let tId in p.teams) {
          let teamsOfPlayer = this.af.database.object(this.am.getTeamsOfPlayerRef(p.$key, tId));
          teamsOfPlayer.set(true);
        }
      })
    })

    let teams = this.af.database.list('/teams');
    teams.subscribe(ts => {
      ts.forEach(t => {
        for (let pId in t.players) {
          let playersOfTeam = this.af.database.object(this.am.getPlayersOfTeamRef(pId, t.$key));
          playersOfTeam.set(true);
        }
      })
    })
  }
}
