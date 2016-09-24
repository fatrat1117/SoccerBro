import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager';
import {MyTeamPage} from '../my-team/my-team';
import {FirebaseManager} from "../../providers/firebase-manager";
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/manage-player/manage-player.html',
  pipes: [PlayerBasicPipe, transPipe]
})
export class ManagePlayerPage {
  players: any;
  busy: boolean;
  tId: any;

  constructor(private am: AccountManager,
  private af: AngularFire, 
  private navParams: NavParams,
  private nav : NavController,
  private fm: FirebaseManager) {
    this.tId = this.navParams.get('tId');
    this.players = this.fm.getPlayers(this.tId);
    this.busy = false;
    // this.teams = [];
    // let self = this;
    // this.am.getTeamsOfPlayerSnapshot(pId, this.teams);
    // this.am.afGetTeamsOfPlayer(pId).subscribe(_=>{
    //   console.log("team list changed, update manage team UI");
    //   this.teams =  this.am.getTeamsOfCurrentPlayerSnapshot();
    // });
  }

  // makeDefault (team, e) {
  //   e.stopPropagation();

  //   this.busy = true;
  //   let self = this;
  //   var success = function (){
  //       self.busy = false;
  //   }

  //   var error = function (err) {
  //     alert(err);
  //     self.busy = false;
  //   }
  //   this.am.switchTeam(team.$key, success, error);
  // }
  
  // quit(team) {
  //   this.busy = true;
  //   let self = this;

  //   var success = function (){
  //     //delete team from UI
  //     self.teams.splice(self.teams.indexOf(team), 1);
  //       self.busy = false;
  //   }

  //   var error = function (err) {
  //     alert(err);
  //     self.busy = false;
  //   }

  //   this.am.quitTeam(team.$key, success, error);
  // }

  // isDefault (team) {
  //   return this.am.isDefaultTeam(team.$key);
  // }
  
  // goTeamPage(team) {
  //   this.nav.push(MyTeamPage, {
  //     tId: team.$key,
  //   });
  // }

  // migrateOldData() {
  //   let players = this.af.database.list('/players');
  //   players.subscribe(ps => {
  //     ps.forEach(p => {
  //       for (let tId in p.teams) {
  //         let teamsOfPlayer = this.am.afGetTeamOfPlayer(p.$key, tId);
  //         teamsOfPlayer.set(true);
  //       }
  //     })
  //   })

  //   let teams = this.af.database.list('/teams');
  //   teams.subscribe(ts => {
  //     ts.forEach(t => {
  //       for (let pId in t.players) {
  //         let playersOfTeam = this.am.afGetPlayerOfTeam(pId, t.$key);
  //         playersOfTeam.set(true);
  //       }
  //     })
  //   })
  // }
}
