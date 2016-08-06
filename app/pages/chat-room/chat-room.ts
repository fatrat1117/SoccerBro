import {Component, ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseDatabase} from 'angularfire2';
import {CalendarPipe} from 'angular2-moment';
import * as moment from 'moment';

import { Subject } from 'rxjs/Subject';


declare let firebase: any;

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
  pipes: [CalendarPipe],
})
export class ChatRoomPage {
  @ViewChild(Content) content: Content;
  // firebase
  items: FirebaseListObservable<any[]>;
  sizeSubject: Subject<any>;
  currentSize: number;
  tempTime: number;
  today: number;
  daysAgo: number;
  // new
  newMessage: string;

  constructor(private navCtrl: NavController, private af: AngularFire) {
    this.currentSize = 10;
    this.tempTime = 0;
    this.today = moment().unix() * 1000;
    this.daysAgo = -1;
    this.newMessage = '';
    this.sizeSubject = new Subject();
    
    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ', {
      query: {
        limitToLast: this.sizeSubject
      }
    });
    
    this.items.subscribe(() => {
      this.content.scrollToBottom();
    });
    
  }

  ionViewWillEnter() {
    this.sizeSubject.next(this.currentSize);
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  trackByKey(_item) {
    return _item.key
  }

  showTime(_item) {
    var current = _item.created_at;
    var isShow = current - this.tempTime > 300000; // 5 mins
    this.tempTime = current;
    return isShow;
  }

  getTime(_item) {
    var newTime: string;
    var current = _item.created_at;
    var count = moment(this.today).diff(moment(current), 'days');
    
    if (count != this.daysAgo) {
      
      newTime = moment(current).calendar(null, {
        sameDay: '[Today] HH:mm',
        lastDay: '[Yesterday] HH:mm',
        lastWeek: 'ddd HH:mm',
        sameElse: 'M/DD/YY HH:mm'
      });
      this.daysAgo = count;
    }
    else {
      newTime = moment(current).format('HH:mm');
    }
    
    return newTime;
  }

  sendMessage() {
    this.items.push({
      content: this.newMessage,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      created_by: 'Lei Zeng',
      creator_id: 'VP0ilOBwY1YM9QTzyYeq23B82pR2',
      creator_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c137.42.527.527/s50x50/564861_2507790311879_276618826_n.jpg?oh=00e78ee4def9be67f27037883729c6fb&oe=580B5051',
    });
  
    this.newMessage = '';
  }

  doRefresh(refresher) {
    this.currentSize +=10;
    this.sizeSubject.next(this.currentSize); 

    setTimeout(() => {
      this.content.scrollToTop();
      refresher.complete();
    }, 500);
  }
}
