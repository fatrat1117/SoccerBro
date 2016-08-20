import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/notification/notification.html'
})
export class NotificationPage {
  matchInfo: FirebaseObjectObservable<any>;
  team1: FirebaseObjectObservable<any>;
  team2: FirebaseObjectObservable<any>;
  constructor(private navCtrl: NavController, private navParams: NavParams, private af: AngularFire) {
    let id = navParams.get("match_id");
    af.database.object('/match-notifications/VP0ilOBwY1YM9QTzyYeq23B82pR2/' + id).update({
      isRead: true
    });

    this.matchInfo = af.database.object('/matches/' + id);
    this.matchInfo.subscribe(snapshot => {
      this.team1 = af.database.object('/teams/' + snapshot.team_id);
      this.team2 = af.database.object('/teams/' + snapshot.opponent_id);
    });
  }

  getColorStyle() {
    let style = {
      'color': 'yellow'
    };
    return style;
  }
}
