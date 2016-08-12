import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import{StandingsPage}from '../standings/standings';

@Component({
  templateUrl: 'build/pages/stats/stats.html'
})
export class StatsPage {
  stats: string = "team";
  constructor(private navCtrl: NavController) {
  }
  enterStandings(){
    this.navCtrl.push(StandingsPage);
  }
}
