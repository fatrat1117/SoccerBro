import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatRoomPage} from '../chat-room/chat-room';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

import { Observable } from 'rxjs/Observable';

declare let firebase: any;
@Component({
  templateUrl: 'build/pages/message/message.html'
})
export class MessagePage {
  message: string;
  notifications = [];
  // firebase
  items: FirebaseListObservable<any[]>;
  
  constructor(private navCtrl: NavController, private af: AngularFire) {
    this.message = "chats";

    // firebase

    this.items = af.database.list('/notifications/VP0ilOBwY1YM9QTzyYeq23B82pR2');
    this.items.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        var n = af.database.object(`/notification-contents/${snapshot.id}`).subscribe(
          s => {
            this.notifications.push(s)
        })
        //this.notifications.push(af.database.object(`/notification-contents/${snapshot.id}`));
        //console.log(this.notifications[0]);      
      });
    })
  }

  getNotification() {

  }

  enterChatRoom(){
    this.navCtrl.push(ChatRoomPage);
  }

  trackByKey(_item) {
      return _item.key
  }

  getTitle(_id) {
    return this.af.database.object('/notification-contents/' + _id)
  }

  test() {
    this.af.database.list('/notification-contents/').push({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      title: "new notification",
      content: 'this is a test notification',
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      team_id: '-KL1QXqFWsC1Jbb-HXsJ'
    });

    /*
    var uid = this.uuid();
    this.af.database.object('/notification-contents/' + uid).set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: 'this is a test notification',
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      team_id: '-KL1QXqFWsC1Jbb-HXsJ'
    });

    this.items.push({
      id: uid,
      isRead: false,
     });
     */
  }

  uuid() {
    var i, random;
    var result = '';

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            result += '-';
        }
        result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }

    return result;
  };
}
