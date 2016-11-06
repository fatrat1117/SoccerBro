import { Component } from '@angular/core';
import { ViewController, ModalController, PopoverController } from 'ionic-angular';
import { ColorPickerPage } from '../color-picker/color-picker';
import { FirebaseManager } from '../../providers/firebase-manager'
import { AccountManager } from '../../providers/account-manager'
import { StringToDatePipe } from '../../pipes/moment.pipe';
import { TeamBasicPipe } from '../../pipes/team-basic.pipe';
import { transPipe } from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/match-notification/match-notification.html',
  pipes: [transPipe, StringToDatePipe, TeamBasicPipe]
})
export class MatchNotPage {
  matches: any;
  jerseyColor: string;
  notice: string;
  pushIds = [];
  upcomingMatch: any;
  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, private popoverCtrl: PopoverController,
    private fm: FirebaseManager, private am: AccountManager) {
    this.matches = this.fm.getSelfUnpostedMatches();

    this.jerseyColor = 'transparent';
    this.notice = "";

    // push notification
    if (this.fm.selfTeamId) {
      this.fm.getPlayersObj(this.fm.selfTeamId).subscribe(snapshot => {
        if (snapshot.$value) {
          for (let pId in snapshot) {
            if (pId != '$key') {
              this.fm.getPlayerDetail(pId).subscribe(detail => {
                console.log('get push ids', detail);
                if (detail && detail.pushId)
                  this.pushIds.push(detail.pushId);
              });
            }
          }
        }
      });
    }
  }


  pickColor() {
    let popover = this.popoverCtrl.create(ColorPickerPage);
    popover.onDidDismiss(data => {
      if (data != null)
        this.jerseyColor = data.color;
    });
    popover.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // post
  postNewMatch() {
    //console.log(this.upcomingMatch);

    // let time = moment(this.matchDate + " " + this.matchTime).unix() * 1000;


    // this.fm.addSelfMatch({
    //   //timestamp: firebase.database.ServerValue.TIMESTAMP,
    //   //creatorId: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
    //   //teamId: '-KLBMI-QFYiaW5nSqOjR',
    //   opponentId: this.opponent.id,
    //   time: time,
    //   color: this.jerseyColor,
    //   locationName: this.location.name,
    //   locationAddress: this.location.address,
    //   notice: this.notice
    // });

    // // push notification
    // let message = {
    //     'en': "A new match is waiting for you to join!",
    //     'zh-Hans': "一场新球赛等待你的加入！" 
    // };

    // //let success = result => {};
    // //let error = err => {};
    // this.am.postNotification(message, this.pushIds);

    // this.dismiss();
  }
}
