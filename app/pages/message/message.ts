import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import * as moment from 'moment';
declare let firebase: any;

import {FirebaseManager} from '../../providers/firebase-manager';
import {ChatRoomPage} from '../chat-room/chat-room';
import {MatchInfoPage} from '../match-info/match-info';
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
  // firebase

  constructor(private navCtrl: NavController, private modalController: ModalController, private fm: FirebaseManager) {
    this.message = "chats";
    this.teams = [];
    this.matches = [];

    this.teams = fm.getSelfTeams();
    this.matches = fm.getSelfMatchNotifications();

  }

  enterChatRoom(id) {
    this.navCtrl.push(ChatRoomPage, {teamId: id});
  }

  showNotification(teamId: string, opponentId: string, matchId: string) {
    this.navCtrl.push(MatchInfoPage, {
      teamId: teamId,
      opponentId: opponentId,
      matchId: matchId
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

  postNewMatch() {
    let modal = this.modalController.create(NewMatchPage);
    modal.present();
  }
}
