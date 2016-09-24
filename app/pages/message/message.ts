import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
declare let firebase: any;
import {transPipe} from '../../providers/localization'
import {FirebaseManager} from '../../providers/firebase-manager';
import {ChatRoomPage} from '../chat-room/chat-room';
import {MatchInfoPage} from '../match-info/match-info';
import {NewMatchPage} from '../new-match/new-match';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {MatchInfoPipe} from '../../pipes/match-info.pipe';
import {MatchFilterPipe} from '../../pipes/match-filter.pipe';
import {MomentPipe} from '../../pipes/moment.pipe';
import {AccountManager} from '../../providers/account-manager';
import {Localization} from '../../providers/localization';

@Component({
  templateUrl: 'build/pages/message/message.html',
  pipes: [TeamBasicPipe, MatchInfoPipe, MatchFilterPipe, transPipe, MomentPipe]
})
export class MessagePage {
  message: string;
  teams: any;
  matches: any;
  uid = '';
  // firebase

  constructor(private navCtrl: NavController, 
              private modalController: ModalController, 
              private fm: FirebaseManager,
              private am: AccountManager,
              private local: Localization) {
    this.message = "chats";
    //this.teams = [];
    //this.matches = [];
  }

  ionViewWillEnter() {
    if (this.uid != this.fm.selfId) {
      setTimeout(() => {

        this.teams = this.fm.getSelfTeams();
        this.matches = this.fm.getSelfMatchNotifications();
      }, 500);
      this.uid = this.fm.selfId;
    }
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

  /*
  getTime(_timestamp) {
    return moment(_timestamp).calendar(null, {
      sameDay: `[${this.local.getString('Today')}] h:mm A`,
      nextDay: `[${this.local.getString('Tomorrow')}] h:mm A`,
      nextWeek: 'ddd h:mm A',
      sameElse: 'MM/DD h:mm A'
    });
  }

  swipeTo(name: string) {
    this.message = name;
  }
  */
}
