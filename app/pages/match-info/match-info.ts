import {Component} from '@angular/core';
import {NavController, AlertController, ViewController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {transPipe} from '../../providers/localization'
import {FirebaseManager} from '../../providers/firebase-manager';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MatchInfoPipe} from '../../pipes/match-info.pipe';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';

@Component({
  templateUrl: 'build/pages/match-info/match-info.html',
  pipes: [TeamBasicPipe, MatchInfoPipe, PlayerBasicPipe, transPipe]
})
export class MatchInfoPage {
  selfId: string;
  teamId: string;
  opponentId: string;
  matchId: string;
  isGoing: boolean;
  matchPlayers: any;
  constructor(private navCtrl: NavController, private navParams: NavParams, private fm: FirebaseManager, 
              private alertCtrl: AlertController, private viewCtrl: ViewController) {
    this.selfId = fm.selfId;
    this.teamId = navParams.get("teamId");
    this.opponentId = navParams.get("opponentId");
    this.matchId = navParams.get("matchId");
    this.isGoing = false;
    this.matchPlayers = [];
    this.fm.changeNotificationStatus(this.matchId, true);

    //this.matchPlayers = fm.getMatchPlayers(this.teamId, this.matchId);
    fm.getMatchPlayers(this.teamId, this.matchId).subscribe(snapshots => {
      this.isGoing = false;
      this.matchPlayers = [];
      snapshots.forEach(snapshot => {
        if (snapshot.$key == fm.selfId) {
          this.matchPlayers.unshift(snapshot);
          this.isGoing = true;
        }
        else
          this.matchPlayers.push(snapshot);
      })
    });
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

  withDrawMatch() {
    let alert = this.alertCtrl.create({
      title: 'Withdraw this match?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Withdraw',
          handler: () => {
            this.fm.withdrawSelfMatch(this.matchId);
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  trackByKey(player: any) {
    return player.$key
  }
}
