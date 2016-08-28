import {Component, ViewChild, Pipe, PipeTransform} from '@angular/core';
import {Content} from 'ionic-angular';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
//import {CalendarPipe} from 'angular2-moment';
import { Subject } from 'rxjs/Subject';

import * as moment from 'moment';
declare let firebase: any;

import {FirebaseManager} from '../../providers/firebase-manager';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';

@Pipe({
  name: "isInRange"
})

export class IsInRange implements PipeTransform {
   transform(time: number) {
     return true;
   }
}

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
  pipes: [PlayerBasicPipe, IsInRange]
})

export class ChatRoomPage {
  @ViewChild(Content) content: Content;
  teamId: string;
  // firebase
  items: FirebaseListObservable<any[]>;
  snapshots: any[];
  sizeSubject: Subject<any>;
  currentSize: number;
  // new
  newMessage: string;

  constructor(private navCtrl: NavController, private af: AngularFire, private fm: FirebaseManager, params: NavParams) {
    this.teamId = params.get("teamId");
    
    this.currentSize = 10;
    this.newMessage = '';
    this.sizeSubject = new Subject();
    this.items = fm.getSelfChatMessages(this.teamId, this.sizeSubject);
    
    this.items.subscribe(snapshots => {
      this.snapshots = snapshots;
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

  getPlayer(id: string) {
    return this.fm.getPlayerBasic(id)
  }

  showTime(index) {
    if (index == 0)
      return true;
    
    return (this.snapshots[index].createdAt - this.snapshots[index-1].createdAt > 300000);
  }

  getTime(index) {
    var isTheSameDay: boolean;
    var current = this.snapshots[index].createdAt;
    if (index == 0)
      isTheSameDay = false;
    else if (moment().diff(moment(this.snapshots[index-1].createdAt), 'days') < 1)
      isTheSameDay = true;
    else
      isTheSameDay = false;

    var newTime: string;
    //if (count != this.daysAgo) {
    if (!isTheSameDay) {
      newTime = moment(current).calendar(null, {
        sameDay: '[Today] HH:mm',
        lastDay: '[Yesterday] HH:mm',
        lastWeek: 'ddd HH:mm',
        sameElse: 'M/DD/YY HH:mm'
      });
      //this.daysAgo = count;
    }
    else {
      newTime = moment(current).format('HH:mm');
    }
    
    return newTime;
  }

  sendMessage() {
    this.fm.addSelfChatMessage(this.teamId, this.newMessage);
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
