import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/team/team.html'
})
export class TeamPage {
  constructor(private navCtrl: NavController, public af: AngularFire) {
  
  }

  login() {
  //this.af.auth.login();
    // Facebook.login(["public_profile"]).then(
    //   userData => {
    //     console.log("UserInfo: ", userData);
    //   },
    //   err => console.error("Error taking picture", err)
    // );
  }
}
