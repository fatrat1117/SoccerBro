import {Component, ViewChild} from '@angular/core';
import {Keyboard} from 'ionic-native';
import {Content} from 'ionic-angular';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Subject } from 'rxjs/Subject';

import * as moment from 'moment';
declare let firebase: any;

import {FirebaseManager} from '../../providers/firebase-manager';
import {PlayerBasicPipe} from '../../pipes/player-basic.pipe';
import {MomentPipe} from '../../pipes/moment.pipe';
import {transPipe} from '../../providers/localization'
import {Localization} from '../../providers/localization';

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
  pipes: [PlayerBasicPipe, transPipe]
})

export class ChatRoomPage {
  @ViewChild(Content) content: Content;
  teamId: string;
  // firebase
  //items: FirebaseListObservable<any[]>;
  messages: any[];
  sizeSubject: Subject<any>;
  currentSize: number;
  // new
  playersCache: { [key:string]:any; };
  newMessage: string;
  // keyboard
  showSub: any;
  hideSub: any;

  constructor(private navCtrl: NavController, private af: AngularFire, 
              private fm: FirebaseManager, private loacal: Localization, 
              params: NavParams) {
    this.teamId = params.get("teamId");
    this.playersCache = {};

    this.currentSize = 10;
    this.newMessage = '';
    this.sizeSubject = new Subject();

    fm.getSelfChatMessages(this.teamId, this.sizeSubject).subscribe(snapshots => {
      snapshots.forEach(s => {
        let k = s.createdBy;
        
        if (this.playersCache[k] === undefined) {
          this.fm.getPlayerBasic(k).subscribe(p => {
            let player: any = {};
            player.name = p.displayName;
            player.photo = p.photoURL;
            this.playersCache[k] = player;
          })
        }
      })
      this.messages = snapshots;
    })
  }

  scrollToBottom() {
    this.content.resize();
    this.content.scrollToBottom();
  }

  ionViewWillEnter() {
    this.sizeSubject.next(this.currentSize);
  }

  ionViewDidEnter() {
    this.showSub = Keyboard.onKeyboardShow().subscribe(() => {
      this.scrollToBottom(); 
    })
    this.hideSub = Keyboard.onKeyboardHide().subscribe(() => {
      this.scrollToBottom(); 
    })
    this.scrollToBottom();
  }

  ionViewDidLeave() {
    if (this.showSub) {
      this.showSub.unsubscribe();
    }
    if (this.hideSub) {
      this.hideSub.unsubscribe();
    }
  }


  trackByKey(item) {
    return item.key
  }

  getPlayer(id: string) {
    return this.playersCache[id]
  }

  isSelf(id: string) {
    return id == this.fm.selfId;
  }

  showTime(index) {
    if (index == 0)
      return true;

    return (this.messages[index].createdAt - this.messages[index - 1].createdAt > 300000);
  }

  showAvatar(index) {
    if (index == 0)
      return true;

    if (this.showTime(index))
      return true;

    return !(this.messages[index].createdBy == this.messages[index - 1].createdBy);
  }

  getTime(index) {
    var isTheSameDay: boolean;
    var current = this.messages[index].createdAt;
    if (index == 0)
      isTheSameDay = false;
    else if (moment(current).diff(moment(this.messages[index - 1].createdAt), 'days') < 1)
      isTheSameDay = true;
    else
      isTheSameDay = false;

    var newTime: string;
    //if (count != this.daysAgo) {
    if (!isTheSameDay) {
      newTime = new MomentPipe(this.loacal).transform(current);
      /*
      newTime = moment(current).calendar(null, {
        sameDay: '[Today] HH:mm',
        lastDay: '[Yesterday] HH:mm',
        lastWeek: 'ddd HH:mm',
        sameElse: 'M/DD/YY HH:mm'
      });
      */
      //this.daysAgo = count;
    }
    else {
      newTime = moment(current).format('HH:mm');
    }

    return newTime;
  }

  sendMessage(input) {
    this.focusInput(input);
    this.fm.addSelfChatMessage(this.teamId, this.newMessage);
    this.newMessage = '';
  }

  doRefresh(refresher) {
    this.currentSize += 10;
    this.sizeSubject.next(this.currentSize);

    setTimeout(() => {
      this.content.scrollToTop();
      refresher.complete();
    }, 500);
  }

  focusInput(input) {
    //console.log(input);
    input.focus();
  }
}
