import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import{StandingsPage}from '../standings/standings';

@Component({
  templateUrl: 'build/pages/stats/stats.html'
})
export class StatsPage {
  stats: string = "teams";
  constructor(private navCtrl: NavController) {
  }
  enterStandings(){
    this.navCtrl.push(StandingsPage);
  }

  swipeTo(name: string) {
    this.stats = name;
  }
}
