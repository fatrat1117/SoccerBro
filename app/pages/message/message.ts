import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import {CalendarPipe} from 'angular2-moment';
import * as moment from 'moment';
declare let firebase: any;

import {ChatRoomPage} from '../chat-room/chat-room';
import {NotificationPage} from '../notification/notification';

@Component({
  templateUrl: 'build/pages/message/message.html'
})
export class MessagePage {
  message: string;
  //matches = [];
  // firebase
  matchItems: FirebaseListObservable<any[]>;
  
  constructor(private navCtrl: NavController, private af: AngularFire) {
    this.message = "chats";

    // firebase
    this.matchItems = af.database.list('/matchlist/VP0ilOBwY1YM9QTzyYeq23B82pR2', {
      query: { orderByChild: 'time'}
    });

    /*
    this.matchItems.subscribe(snapshots => {
      this.matches = [];
      snapshots.forEach(snapshot => {
        var n = af.database.object(`/notification-details/${snapshot.$key}`).subscribe(
          s => {
            s.isRead = snapshot.isRead;
            this.matches.push(s);
        })
      });
    })
    */
  }

  enterChatRoom(){
    this.navCtrl.push(ChatRoomPage);
  }

  showNotification(_key){
    this.navCtrl.push(NotificationPage, {
      match_id: _key
    });
  }

  trackByKey(_item) {
      return _item.key
  }

  getTime(_timestamp) {
    return moment(_timestamp).calendar(null, {
      sameDay: '[Today] HH:mm',
      nextDay: '[Tomorrow] HH:mm',
      nextWeek: 'ddd HH:mm',
      sameElse: 'MM/DD HH:mm'
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
}
