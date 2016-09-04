import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import{StandingsPage}from '../standings/standings';
import {FirebaseManager} from '../../providers/firebase-manager';
import {Subject} from 'rxjs/Subject';
import {PlayerBasicPipe, playerDetailPipe} from '../../pipes/player-basic.pipe';
import {MyPlayerPage} from '../my-player/my-player';

@Component({
  templateUrl: 'build/pages/stats/stats.html',
  pipes: [PlayerBasicPipe, playerDetailPipe]
})
export class StatsPage {
  stats: string = "team";
  afPlayers: any;

  constructor(private nav: NavController,
  private fm: FirebaseManager) {
    this.afPlayers = fm.getPublicPlayers('popularity');
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, {pId: id});
  }

  enterStandings(){
    this.nav.push(StandingsPage);
  }
}
