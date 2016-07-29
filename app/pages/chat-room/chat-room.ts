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
  timeFormat: string;
  today: number;

  constructor(private navCtrl: NavController, af: AngularFire) {
    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ');
    this.tempTime = 0;
    this.timeFormat = "M/DD/YYYY HH:MM";
    this.today = moment().unix() * 1000;
    //console.log(this.today)
  }

  showTime(_item) {
    var isShow = false;
    var current = _item.created_at;
    var daysAgo = 0;
    //console.log(moment.duration(this.today-current).asWeeks());
    console.log(current - this.tempTime);
    if (current - this.tempTime > 300000)
    {
      isShow = true;
    }

    this.tempTime = current;
    return isShow;
  }
}
