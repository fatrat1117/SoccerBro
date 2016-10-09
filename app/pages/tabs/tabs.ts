import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, ModalController, Tabs, LoadingController} from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {HomePage} from '../home/home';
import {StatsPage} from '../stats/stats';
import {MessagePage} from '../message/message';
import {MePage} from '../me/me';
import {MyTeamPage} from '../my-team/my-team';
import {AccountManager} from '../../providers/account-manager'
import {transPipe} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  pipes: [transPipe]
})
export class TabsPage implements OnInit {
  @ViewChild('mainTabs') tabRef: Tabs;

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;
  //loading : any;
  //private tab5Root: any;

  constructor(private am: AccountManager,
    private nav: NavController,
    private modalController: ModalController,
    private af: AngularFire,
    private loadingCtrl: LoadingController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    am.presentLoading(3000, false);
    this.tab1Root = HomePage;
    this.tab2Root = StatsPage;
    this.tab3Root = null;
    this.tab4Root = null;
    //this.loading = loadingCtrl.create();
    //this.tab5Root = MyTeamPage;
  }

  ngOnInit() {
    console.log("ngOnInit");
    let self = this;

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.am.presentLoading();

        let success = () => {
          //console.log(self.tab4Root);
          if (null === self.tab4Root) {
            self.tab4Root = MePage;
            self.tab3Root = MessagePage;
            console.log('initialize success');
            self.am.dismissLoading();
          }
        }

        let error = err => {
          alert(err);
        }
        console.log("logged in gopage", user);
        self.am.initialize(user, success, error)
      } else {
        self.tabRef.select(0);
        self.tab3Root = null;
        self.tab4Root = null;
        self.am.uninitialize();
        console.log("logout");
      }
    });
  }

  checkLogin() {
    this.am.checkLogin(this.modalController);
    //console.log("checkLogin finish");
  }
}
