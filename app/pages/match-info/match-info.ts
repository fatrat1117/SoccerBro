import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment';

import {FirebaseManager} from '../../providers/firebase-manager';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MatchInfoPipe} from '../../pipes/match-info.pipe';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';

@Component({
  templateUrl: 'build/pages/match-info/match-info.html',
  pipes: [TeamBasicPipe, MatchInfoPipe, PlayerBasicPipe]
})
export class MatchInfoPage {
  teamId: string;
  opponentId: string;
  matchId: string;
  matchPlayers: any;
  isGoing: boolean;
  constructor(private navCtrl: NavController, private navParams: NavParams, private fm: FirebaseManager) {
     this.teamId = navParams.get("teamId");
     this.opponentId = navParams.get("opponentId");
     this.matchId = navParams.get("matchId");
     this.matchPlayers = fm.getMatchPlayers(this.teamId, this.matchId);
     this.isGoing = false;
    /*
    af.database.object('/match-notifications/VP0ilOBwY1YM9QTzyYeq23B82pR2/' + id).update({
      isRead: true
    });
    */
  }

  getTime(time: number) {
    return moment(time).format("h:mm A")
  }

  getDay(time: number) {
    return moment(time).format("dddd")
  }

  getDate(time: number) {
    return moment(time).format("YYYY-MM-DD")
  }

  joinMatch() {
    this.fm.joinMatch(this.teamId, this.matchId);
  }

  leaveMatch() {
    this.fm.leaveMatch(this.teamId, this.matchId);
  }
}
