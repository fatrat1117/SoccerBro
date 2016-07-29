import {Modal, NavController, Page} from 'ionic-angular';
import { Injectable} from '@angular/core';
import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';
import {LoginPage} from '../pages/login/login'

declare let firebase: any;

@Injectable()
export class AccountManager{

  constructor(public af: AngularFire) {
  }

  getUser() {
    //console.log(firebase.auth());
    var currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    if (currentUser)
    {
      var user = {
          uid: currentUser.uid,
          type: 'facebook'
      }
      return user;
    }  
    return null;
  }

displayLoginModal(nav) {
        let loginPage = Modal.create(LoginPage);
        nav.present(loginPage);
    }

  checkLogin(nav) {
    var user = this.getUser();
    console.log(user);
    if (!user) {
      this.displayLoginModal(nav);
    }
  }
}
