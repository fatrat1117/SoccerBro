import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, ModalController, Tabs, LoadingController} from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import {HomePage} from '../home/home';
import {StatsPage} from '../stats/stats';
import {MessagePage} from '../message/message';
import {MePage} from '../me/me';
import {MyTeamPage} from '../my-team/my-team';
import {AccountManager} from '../../providers/account-manager'

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage implements OnInit {
  @ViewChild('mainTabs') tabRef: Tabs;

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;
  //private tab5Root: any;

  constructor(private am: AccountManager,
    private nav: NavController,
    private modalController: ModalController,
    private af: AngularFire,
    private loadingCtrl: LoadingController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = StatsPage;
    this.tab3Root = null;
    this.tab4Root = null;
    //this.tab5Root = MyTeamPage;
  }

  ngOnInit() {
    console.log("ngOnInit");
    let self = this;
    let loading;

    let success = () => {
      //console.log(self.tab4Root);
      if (null === self.tab4Root) {
        self.tab4Root = MePage;
        self.tab3Root = MessagePage;
        console.log('initialize success');
        if (loading)
          loading.dismiss();
      }
    }

    let error = err => {
      alert(err);
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        loading = self.loadingCtrl.create({});
        loading.present();
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
