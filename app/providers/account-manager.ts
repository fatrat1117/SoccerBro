import { Injectable } from '@angular/core';
import {CordovaOauth, Facebook} from 'ng2-cordova-oauth/core';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';
import {LoginPage} from '../pages/login/login'

declare let firebase: any;

@Injectable()
export class AccountManager {
  private cordovaOauth: CordovaOauth;

  constructor(private af: AngularFire) {
    this.cordovaOauth = new CordovaOauth(new Facebook({clientId: "502807016597247", appScope: ["email"]}));
  }

  facebook() {
         this.cordovaOauth.login().then(success => {
            console.log("Facebook success: " + JSON.stringify(success));
            let creds = firebase.auth.FacebookAuthProvider.credential(success["access_token"]);
            console.log(creds);

            let providerConfig = {
            provider: AuthProviders.Facebook,
            method: AuthMethods.OAuthToken,
            remember: 'default',
            scope: ['email'],
          };
            //console.log(success["access_token"]);
            // var provider = new firebase.auth.FacebookAuthProvider();
            // console.log(provider);
            //  let creds = provider.credential(success["access_token"]);//firebase.auth.FacebookAuthProvider;.credential(success["access_token"]);
            //  console.log(creds);
            this.af.auth.login(creds, providerConfig).then((value) => {
              console.log('firebase success');
            console.log(value);
            //this.dismiss()
        }).catch((error) => {
            //this.error = error
            console.log(error)
        });
      });
    }
}
