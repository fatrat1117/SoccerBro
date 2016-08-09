import {Component, Pipe, PipeTransform} from '@angular/core';
import { NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager';

@Pipe({ name: 'teamFb' })
export class GetTeamFb implements PipeTransform {
  constructor(private am: AccountManager, private af: AngularFire) {

  }
  transform(teams) {
    if (teams) {
      console.log("transform team to team fb", teams);
      for (let i = 0; i < teams.length; ++i) {
        teams[i] = this.af.database.object(this.am.getTeamRef(teams[i].$key));
      }
      return teams;
    }
  }
}

@Component({
  templateUrl: 'build/pages/manage-team/manage-team.html',
  pipes: [GetTeamFb]
})
export class ManageTeamPage {
  teams: any;
  busy: boolean;

  constructor(private am: AccountManager, private af: AngularFire, private navParams: NavParams) {
    let id = this.navParams.get('id');
    this.busy = false;
    this.teams = this.af.database.list(this.am.getAllTeamsOfPlayerRef(id));
  }

  getTeamData(tId) {
    return this.am.getTeamRef(tId);
    //console.log("team id", tId);
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
