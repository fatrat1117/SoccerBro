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
export class AccountManager {
  private currentUser: any;

  constructor(public af: AngularFire) {
    let self = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.currentUser = self.getFbUser();
        console.log("User is signed in", self.currentUser);
      } else {
        console.log("logout");
        self.currentUser = null;
      }
    });

    //this.currentUser = this.getUser();
  }

  getFbUser() {
    //console.log(firebase.auth());
    var currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    if (currentUser) {
      var user = {
        uid: currentUser.uid,
        type: 'facebook'
      }
      return user;
    }
    return null;
  }


  getUser() {
    return this.getFbUser();
  }

  displayLoginModal(nav) {
    let loginPage = Modal.create(LoginPage);
    nav.present(loginPage);
  }

  checkLogin(nav) {
    var user = this.currentUser;
    console.log(user);
    if (!user) {
      this.displayLoginModal(nav);
    }
  }

  logout() {
    this.af.auth.logout();
  }

  getPlayerRef(id) {
    return "/players/" + id;
  }

  getCurrentPlayerRef() {
    return this.getPlayerRef(this.currentUser.uid);
  }
}
