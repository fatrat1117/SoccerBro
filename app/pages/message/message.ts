import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import * as moment from 'moment';
declare let firebase: any;

import {FirebaseManager} from '../../providers/firebase-manager';
import {ChatRoomPage} from '../chat-room/chat-room';
import {NotificationPage} from '../notification/notification';
import {NewMatchPage} from '../new-match/new-match';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MatchInfoPipe} from '../../pipes/match-info.pipe';

@Component({
  templateUrl: 'build/pages/message/message.html',
  pipes: [TeamBasicPipe, MatchInfoPipe]
})
export class MessagePage {
  message: string;
  teams: any;
  matches: any;
  unReadCount: number;
  // firebase
  matchItems: FirebaseListObservable<any[]>;

  constructor(private navCtrl: NavController, private modalController: ModalController, private fm: FirebaseManager, private af: AngularFire) {
    this.message = "chats";
    this.teams = [];
    this.matches = [];
    this.unReadCount = 0;

    this.teams = fm.getSelfTeams();
    this.matches = fm.getSelfMatchNotifications();

  }

  enterChatRoom(id) {
    this.navCtrl.push(ChatRoomPage, {teamId: id});
  }

  showNotification(_key) {
    this.navCtrl.push(NotificationPage, {
      match_id: _key
    });
  }

  trackByKey(_item) {
    return _item.key
  }

  getTime(_timestamp) {
    return moment(_timestamp).calendar(null, {
      sameDay: '[Today] h:mm A',
      nextDay: '[Tomorrow] h:mm A',
      nextWeek: 'dddd h:mm A',
      sameElse: 'MM/DD h:mm A'
    });
  }


  test() {
    let _time = 1471244400000;
    let _location = "Yio Chu Kang";
    let _opponent_id = '-KLAat2qWsWJVuzVmXlP';
    this.af.database.list('/matches').push({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      time: _time,
      location: _location,
      team_id: '-KLBMI-QFYiaW5nSqOjR',
      opponent_id: _opponent_id,
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      content: 'this is a test notification'
    }).then(item => {

      this.af.database.object('/matchlist/VP0ilOBwY1YM9QTzyYeq23B82pR2/' + item["key"]).set({
        isRead: false,
        time: _time,
        location: _location,
        opponent_id: _opponent_id
      });
    });
  }

  postNewMatch() {
    //this.navCtrl.push(NewNotificationPage);
    let modal = this.modalController.create(NewMatchPage);
    modal.present();
  }
}
