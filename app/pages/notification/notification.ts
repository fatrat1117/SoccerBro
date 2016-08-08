import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/notification/notification.html'
})
export class NotificationPage {
  constructor(private navCtrl: NavController, private navParams: NavParams, private af: AngularFire) {
    let id = navParams.get("match_id");
    af.database.object('/matchlist/VP0ilOBwY1YM9QTzyYeq23B82pR2/' + id).update({
      isRead: true
    });
    
    
    // af.database.object('/notifications/VP0ilOBwY1YM9QTzyYeq23B82pR2/' + id).set({
    //   isRead: true
    // });
  }
}
