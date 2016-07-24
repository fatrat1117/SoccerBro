import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatRoomPage} from '../chat-room/chat-room';

@Component({
  templateUrl: 'build/pages/message/message.html'
})
export class MessagePage {
  message: string = "chats";
  
  constructor(private navCtrl: NavController) {
  }

  enterChatRoom(){
    this.navCtrl.push(ChatRoomPage);
  }
}
