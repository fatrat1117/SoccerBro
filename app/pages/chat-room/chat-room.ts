import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, FirebaseDatabase} from 'angularfire2';
import {CalendarPipe} from 'angular2-moment';
import * as moment from 'moment';

declare let firebase: any;

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
  pipes: [CalendarPipe],
})
export class ChatRoomPage {
  items: FirebaseListObservable<any[]>;
  // histroy
  tempTime: number;
  today: number;
  daysAgo: number;
  // new
  newMessage: string;

  constructor(private navCtrl: NavController, private af: AngularFire) {
    this.tempTime = 0;
    this.today = moment().unix() * 1000;
    this.daysAgo = -1;
    this.newMessage = '';

    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ');
    /*
    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ', {
      query: {
        limitToLast: 10
      }
    });
    */
  }

/*
  ngOnInit() {
    console.log("init");
    
    var msgs = this.af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ', {
      preserveSnapshot: true,
      query: {
        limitToLast: 20
      }
    });

    var self = this;
    msgs.subscribe(snapshots => {
      console.log(self.items.length);
      snapshots.forEach(snapshot => {
        self.items.push(snapshot);
      }
      
      );
      console.log(self.items.length);
    })


  }
*/

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
        sameDay: '[Today] HH:MM',
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

  doRefresh(af: AngularFire) {
    /*
    console.log('Refreshing!'); 
    this.items = this.af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ', {
      query: {
        limitToLast: 20
      }
    });
    */
    /*
    var newItems = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ', {
      preserveSnapshot: true, 
      query: {
        limitToLast: 40
      }
    });

    newItems.subscribe(
      snapshots => {
        snapshots.forEach(snapshot => {
          console.log(snapshot.key)
          console.log(snapshot.val())
        });
    );
    */
  }

}
