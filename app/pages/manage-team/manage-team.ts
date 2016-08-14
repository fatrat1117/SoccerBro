import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager';
import {MyTeamPage} from '../my-team/my-team';
// @Pipe({ name: 'teamFb' })
// export class GetTeamFb implements PipeTransform {
//   constructor(private am: AccountManager, private af: AngularFire) {

//   }
//   transform(teams) {
//     if (teams) {
//       console.log("transform team to team fb", teams);
//       for (let i = 0; i < teams.length; ++i) {
//         teams[i] = this.af.database.object(this.am.getTeamRef(teams[i].$key));
//       }
//       return teams;
//     }
//   }
// }

@Component({
  templateUrl: 'build/pages/manage-team/manage-team.html'
})
export class ManageTeamPage {
  teams: any;
  busy: boolean;

  constructor(private am: AccountManager, 
  private af: AngularFire, 
  private navParams: NavParams,
  private nav : NavController) {
    let id = this.navParams.get('id');
    this.busy = false;
    this.teams =  this.am.getTeamsOfCurrentPlayerSnapshot();
    //this.teams = this.af.database.list(this.am.getAllTeamsOfPlayerRef(id));
  }

  makeDefault (team, e) {
    e.stopPropagation();

    this.busy = true;
    let self = this;
    var success = function (){
        self.busy = false;
    }

    var error = function (err) {
      alert(err);
      self.busy = false;
    }
    this.am.switchTeam(team.$key, success, error);
  }
  
  quit(team) {
    this.busy = true;
    let self = this;

    var success = function (){
        self.busy = false;
    }

    var error = function (err) {
      alert(err);
      self.busy = false;
    }

    this.am.quitTeam(team.$key, success, error);
  }

  isDefault (team) {
    return this.am.isDefaultTeam(team.$key);
  }
  
  goTeamPage(team) {
    this.nav.push(MyTeamPage, {
      tId: team.$key,
    });
  }

  migrateOldData() {
    let players = this.af.database.list('/players');
    players.subscribe(ps => {
      ps.forEach(p => {
        for (let tId in p.teams) {
          let teamsOfPlayer = this.am.afGetTeamOfPlayer(p.$key, tId);
          teamsOfPlayer.set(true);
        }
      })
    })

    let teams = this.af.database.list('/teams');
    teams.subscribe(ts => {
      ts.forEach(t => {
        for (let pId in t.players) {
          let playersOfTeam = this.am.afGetPlayerOfTeam(pId, t.$key);
          playersOfTeam.set(true);
        }
      })
    })
  }
}
