import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import { FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig, AuthProviders, AuthMethods } from 'angularfire2';
import {AccountManager} from './providers/account-manager';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    FIREBASE_PROVIDERS,
    // Initialize Firebase app  
    defaultFirebase({
      apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
      authDomain: "project-3416565325366537224.firebaseapp.com",
      databaseURL: "https://project-3416565325366537224.firebaseio.com",
      storageBucket: "project-3416565325366537224.appspot.com",
      // apiKey: "AIzaSyA9L3ja5ZcViqTc5Tgz8tG6QvJGlYO-fa4",
      // authDomain: "stk-soccer.firebaseapp.com",
      // databaseURL: "https://stk-soccer.firebaseio.com",
      // storageBucket: "stk-soccer.appspot.com",
    }),
    firebaseAuthConfig({}),
    AccountManager
  ]
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
