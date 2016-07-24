import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/message/message.html'
})
export class MessagePage {
  message: string = "chats";
  
  constructor(private navCtrl: NavController) {
  }
}
