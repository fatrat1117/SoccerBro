import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from '../../providers/account-manager';
import {FirebaseManager} from '../../providers/firebase-manager';
import {MyTeamPage} from '../my-team/my-team';
import {CreateTeamPage} from '../create-team/create-team';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';

@Component({
  templateUrl: 'build/pages/manage-team/manage-team.html',
  pipes: [TeamBasicPipe, PlayerBasicPipe]
})
export class ManageTeamPage {
  playerId: string;
  teams: any;
  busy: boolean;
  afTeams: any;

  constructor(private am: AccountManager,
              private af: AngularFire, 
              private navParams: NavParams,
              private nav : NavController,
              private modalController: ModalController,
              private fm: FirebaseManager) {
    this.playerId = this.fm.selfId;
    this.busy = false;
    this.afTeams = fm.getSelfTeams();
    //this.teams = [];
    //let self = this;
    //this.am.getTeamsOfPlayerSnapshot(pId, this.teams);
    // this.am.afGetTeamsOfPlayer(pId).subscribe(_=>{
    //   console.log("team list changed, update manage team UI");
    //   this.teams =  this.am.getTeamsOfCurrentPlayerSnapshot();
    // });
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
      //delete team from UI
      //self.teams.splice(self.teams.indexOf(team), 1);
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

  showCreateTeamModel() {
    let modal = this.modalController.create(CreateTeamPage);
    modal.present();
  }

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
