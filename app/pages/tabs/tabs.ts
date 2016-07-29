import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {HomePage} from '../home/home';
import {StatsPage} from '../stats/stats';
import {MessagePage} from '../message/message';
import {MePage} from '../me/me';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage implements OnInit {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor(private am : AccountManager, private nav: NavController, private af : AngularFire) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = StatsPage;
    this.tab3Root = MessagePage;
    this.tab4Root = MePage;
  }

ngOnInit() {
        console.log("ngOnInit");
        
        // subscribe to the auth object to check for the login status
        // of the user, if logged in, save some user information and
        // execute the firebase query...
        // .. otherwise
        // show the login modal page
        //this.af.auth.subscribe((data) => {
         //   console.log("in auth subscribe", data)

         //   if (data) {
            
            // this.af.auth.unsubscribe()

            //     this.buttonTitle = "LOGOUT"

            //     // if no user, then add it
            //     this.addOrUpdateUser(data)


            //     if (data.auth.providerData[0].providerId === "twitter.com") {
            //         this.authInfo = data.auth.providerData[0]
            //         this.displayName = data.auth.providerData[0].displayName
            //     } else if (data.github) {
            //         this.authInfo = data.github
            //         //this.authInfo.displayName = data.github.displayName
            //     } else {
            //         this.authInfo = data.auth || {}
            //         this.displayName = data.auth.providerData[0].email
            //     }
            //     this.textItems = this.af.database.list('/textItems')

                //this.getMoreData()

           // } else {
                // this.buttonTitle = "LOGIN"
                // this.authInfo = null
                // this.displayLoginModal()
          //  }
        //})
    }

  checkLogin() {
    this.am.checkLogin(this.nav);
  }
}
