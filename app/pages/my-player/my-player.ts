import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {NavController, NavParams} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';
import {TeamBasicPipe} from '../../pipes/team-basic.pipe';
import {transPipe, Localization} from '../../providers/localization'

@Component({
  templateUrl: 'build/pages/my-player/my-player.html',
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [TeamBasicPipe, transPipe]
})
export class MyPlayerPage {
  pId: any;
  //af
  afBasic: any;
  afDetail: any;
  afPublic: any;
  // Radar
  public radarChartLabels:string[];

  public radarChartData:any = [
    [20, 20, 20, 20, 20, 20],
  ];
  public radarChartType:string = 'radar';
  public radarOptions = { legend: { display: false }};

  constructor(private nav: NavController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager,
    private localization: Localization) {
    this.pId = this.navParams.get('pId');
    console.log('open player page', this.pId);
    this.radarChartLabels = [localization.getString('attack'), 
    localization.getString('pass'), 
    localization.getString('speed'),
    localization.getString('defence'),
    localization.getString('stamina'), 
    localization.getString('power')];
    this.afBasic = this.fm.getPlayerBasic(this.pId);
    this.afDetail = this.fm.getPlayerDetail(this.pId);
    this.afPublic = this.fm.getPlayerPublic(this.pId);
    let self = this;
    let success = snapshot => {
      //console.log(self.radarChartData);
      //self.radarChartData = [[snapshot.popularity, snapshot.popularity, snapshot.popularity, snapshot.popularity, snapshot.popularity, snapshot.popularity]];
      //self.radarChartData[0][3] = snapshot.popularity;
    }

    this.fm.increasePopularity(this.afPublic, success);
  }
}
