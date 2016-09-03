import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {NavController, NavParams} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {AccountManager} from "../../providers/account-manager";
import {FirebaseManager} from "../../providers/firebase-manager";
import {ManagePlayerPage} from '../manage-player/manage-player';


@Component({
  templateUrl: 'build/pages/my-player/my-player.html',
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class MyPlayerPage {
  pId: any;
  //af
  afBasic: any;
  afDetail: any;
  afPublic: any;
  // Radar
  public radarChartLabels:string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartData:any = [
    {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
  ];
  public radarChartType:string = 'radar';

  constructor(private nav: NavController,
    private am: AccountManager,
    private navParams: NavParams,
    private fm: FirebaseManager) {
    this.pId = this.navParams.get('pId');
    this.afBasic = this.fm.getPlayerBasic(this.pId);
    this.afDetail = this.fm.getPlayerDetail(this.pId);
    this.afPublic = this.fm.getPlayerPublic(this.pId);
    this.fm.increasePopularity(this.afPublic);
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
  
  // editTeam() {
  //   this.nav.push(EditTeamPage,
  //     {
  //       tId: this.tId
  //     }
  //   );
  // }

  // getTeamAvatar(src){
  //   var image = new Image();
  //   image.src = src
  //   return image;
  // }

  // goManagePlayerPage() {
  //   this.nav.push(ManagePlayerPage, {tId: this.tId});
  // }
}
