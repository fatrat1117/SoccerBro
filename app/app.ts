import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import { FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig, AuthProviders, AuthMethods } from 'angularfire2';
import {AccountManager} from './providers/account-manager';
import {FirebaseManager} from './providers/firebase-manager';
import {GOOGLE_MAPS_PROVIDERS, provideLazyMapsAPILoaderConfig} from 'angular2-google-maps/core';
import '../node_modules/chart.js/dist/Chart.bundle.min.js';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.registerForPushNotifications();
    });
  }

  registerForPushNotifications () {
        let notificationOpenedCallback = jsonData => {
            console.log('didReceiveRemoteNotificationCallBack:', jsonData);
        };

        window["plugins"].OneSignal.init("f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
                                       { googleProjectNumber: "63493717987" },
                                       notificationOpenedCallback);
        window["plugins"].OneSignal.enableInAppAlertNotification(false);
        window["plugins"].OneSignal.enableNotificationsWhenActive(true);
    }
}

ionicBootstrap(MyApp, [FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    // apiKey: "AIzaSyC9HcqulBgzgtzDg-RwSlTvr0lqkbaemyk",
    // authDomain: "soccerbro-schema.firebaseapp.com",
    // databaseURL: "https://soccerbro-schema.firebaseio.com",
    // storageBucket: "soccerbro-schema.appspot.com",
    
    apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
    authDomain: "project-3416565325366537224.firebaseapp.com",
    databaseURL: "https://project-3416565325366537224.firebaseio.com",
    storageBucket: "project-3416565325366537224.appspot.com",
    
  }),
  firebaseAuthConfig({}),
  AccountManager,
  FirebaseManager,
  // google maps
  GOOGLE_MAPS_PROVIDERS,
  provideLazyMapsAPILoaderConfig({
    apiKey: 'AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8',
    libraries: ['places'],
    region: "SG"
  })
], {tabsHideOnSubPages:"true"});
