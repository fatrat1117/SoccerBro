import {Component} from '@angular/core';
import {NavController, AlertController, ViewController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {transPipe} from '../../providers/localization'
import {FirebaseManager} from '../../providers/firebase-manager';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MatchInfoPipe} from '../../pipes/match-info.pipe';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/match-result/match-result.html',
  pipes: [TeamBasicPipe, MatchInfoPipe, PlayerBasicPipe, transPipe]
})
export class MatchResultPage {
  date: number;
  matchId: string;
  matchBasic: any;
  matchStats: any;
  mvp: any;
  constructor(private viewCtrl: ViewController, private params: NavParams, private fm: FirebaseManager) {
    this.date = params.get("date");
    this.matchId = params.get("matchId");

    fm.getMatchBasicData(this.matchId, this.date).subscribe(snapshot => {
      this.matchBasic = snapshot;
      //this.matchBasic.time = this.getTime(snapshot.time);
      //this.matchBasic.day = this.getTime(snapshot.time);
      //this.matchBasic.date = this.getTime(snapshot.time);
    });

    this.matchStats = fm.getMatchStats(this.matchId, this.date);
    fm.getMVPWinner(this.date, this.matchId).subscribe(snapshot => {
      this.mvp = snapshot.$value;
    });
  }


  getTime(time: number) {
    return moment(time).format("HH:mm")
  }

  getDay(time: number) {
    return moment(time).format("dddd")
  }

  getDate(time: number) {
    return moment(time).format("YYYY-MM-DD")
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
