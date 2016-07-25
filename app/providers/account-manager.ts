import { Injectable } from '@angular/core';
import {CordovaOauth, Facebook} from 'ng2-cordova-oauth/core';
import {AngularFire} from 'angularfire2';

@Injectable()
export class AccountManager {
  private cordovaOauth: CordovaOauth;

  constructor(private af: AngularFire) {
    this.cordovaOauth = new CordovaOauth(new Facebook({clientId: "463670290510920", appScope: ["user_birthday"]}));
  }

  facebook() {
         this.cordovaOauth.login().then(success => {
            console.log("Facebook success: " + JSON.stringify(success));
            console.log(success["access_token"]);
            var provider = new firebase.auth.FacebookAuthProvider();
            alert('1');
            firebase.auth().signInWithCredential(provider.credential(success["access_token"]))
              .then((success) => {
                alert('2');
                console.log("Firebase success: " + JSON.stringify(success));
              },
              (error) => {
                alert('3');
                console.log("Firebase failure: " + JSON.stringify(error));
              });
              // .catch((error) => {
              //   console.log("Firebase failure: " + JSON.stringify(error));
              // });
              alert('4');
      });
    }
}
