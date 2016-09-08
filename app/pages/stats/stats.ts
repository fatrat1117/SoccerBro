import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import{StandingsPage}from '../standings/standings';
import {FirebaseManager} from '../../providers/firebase-manager';
import {Subject} from 'rxjs/Subject';
import {PlayerBasicPipe, PlayerDetailPipe, ReversePipe, ReverseAndRecordPlayerLengthPipe} from '../../pipes/player-basic.pipe';
import {MyPlayerPage} from '../my-player/my-player';

@Component({
  templateUrl: 'build/pages/stats/stats.html',
  pipes: [PlayerBasicPipe, PlayerDetailPipe, ReversePipe, ReverseAndRecordPlayerLengthPipe]
})
export class StatsPage {
  stats: string = "teams";
  afPlayers: any;
  maxPlayer = 20;
  enableScroll = true;

  constructor(private nav: NavController, private fm: FirebaseManager) {
    this.afPlayers = fm.getPublicPlayers('popularity', this.maxPlayer);
  }

  goPlayerPage(id) {
    this.nav.push(MyPlayerPage, {pId: id});
  }

  enterStandings(){
    this.nav.push(StandingsPage);
  }

  swipeTo(name: string) {
    this.stats = name;
  }

  doInfinite(infiniteScroll) {
    console.log('more data available');
    setTimeout(() => {
      console.log('updateScroll', this.maxPlayer, this.fm.totalPlayers);
      let enable = this.maxPlayer <= this.fm.totalPlayers;
      if (enable) {
        this.afPlayers = this.fm.getPublicPlayers('popularity', this.maxPlayer + 10);
        this.updateScroll();
      }
      infiniteScroll.enable(enable);
      infiniteScroll.complete();
    }, 500);
  }

  updateScroll() {
    this.maxPlayer += 10;
    //return this.maxPlayer <= this.fm.totalPlayers;
  }
}
