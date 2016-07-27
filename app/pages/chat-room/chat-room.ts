import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/chat-room/chat-room.html',
})
export class ChatRoomPage {
  items: FirebaseListObservable<any[]>;
  constructor(private navCtrl: NavController, af: AngularFire) {
    this.items = af.database.list('/chatrooms/-KL1QXqFWsC1Jbb-HXsJ');
  }
}
