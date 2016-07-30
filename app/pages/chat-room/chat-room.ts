import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {DateFormatPipe} from 'angular2-moment';
import {CalendarPipe} from 'angular2-moment';
import * as moment from 'moment'

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
  pipes: [DateFormatPipe, CalendarPipe],
})
export class ChatRoomPage {
  items: FirebaseListObservable<any[]>;
  tempTime: number;
  today: number;
  daysAgo: number;

  constructor(private navCtrl: NavController, af: AngularFire) {
    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ');
    this.tempTime = 0;
    this.today = moment().unix() * 1000;
    this.daysAgo = 0;
  }

  showTime(_item) {
    var current = _item.created_at;
    var isShow = (current - this.tempTime > 300000); // 5 mins
    this.tempTime = current;
    return isShow;
  }

  getTime(_item) {
    var newTime: string;
    var current = _item.created_at;
    var count = Math.ceil(moment.duration(this.today - current).asDays());
    if (count != this.daysAgo) {
      
      newTime = moment(current).calendar(null, {
        sameDay: 'HH:MM',
        lastDay: '[Yesterday] HH:MM',
        lastWeek: 'ddd HH:MM',
        sameElse: 'M/DD/YY HH:MM'
      });
      this.daysAgo = count;
    }
    else {
      newTime = moment(current).format('HH:MM');
    }
    
    return newTime;
  }
}
